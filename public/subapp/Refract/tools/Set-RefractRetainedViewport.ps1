[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$TabName,

    [string]$VerificationTab,

    [string]$ExpectedUrl,

    # Zero-based occurrence for duplicate app tab titles. All other hand-off
    # checks are retained from the personal arclight-browser-handoff script.
    [ValidateRange(0, 20)]
    [int]$TabOccurrence = 0,

    [ValidateRange(200, 2000)]
    [int]$Width = 360,

    [ValidateRange(200, 3000)]
    [int]$Height = 740
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes

$root = [System.Windows.Automation.AutomationElement]::RootElement
$window = $root.FindAll(
    [System.Windows.Automation.TreeScope]::Children,
    [System.Windows.Automation.Condition]::TrueCondition
) | Where-Object {
    $_.Current.Name -eq 'ChatGPT' -and
    $_.Current.ClassName -eq 'Chrome_WidgetWin_1'
} | Select-Object -First 1

if (-not $window) {
    throw 'The ChatGPT desktop window was not found.'
}

function Find-One {
    param(
        [string]$Name,
        $ControlType
    )

    $nameCondition = New-Object System.Windows.Automation.PropertyCondition(
        [System.Windows.Automation.AutomationElement]::NameProperty,
        $Name
    )
    $typeCondition = New-Object System.Windows.Automation.PropertyCondition(
        [System.Windows.Automation.AutomationElement]::ControlTypeProperty,
        $ControlType
    )
    $condition = New-Object System.Windows.Automation.AndCondition(
        $nameCondition,
        $typeCondition
    )

    $allMatches = $window.FindAll(
        [System.Windows.Automation.TreeScope]::Descendants,
        $condition
    )
    # Hidden sibling controls must never satisfy URL or viewport verification.
    # Reject ambiguity instead of accepting the first control in the window.
    $matches = @($allMatches | Where-Object {
        -not $_.Current.IsOffscreen -and
        $_.Current.BoundingRectangle.Width -gt 0 -and
        $_.Current.BoundingRectangle.Height -gt 0
    })
    if ($Name -eq $TabName -and $ControlType -eq [System.Windows.Automation.ControlType]::TabItem) {
        if ($matches.Count -gt $TabOccurrence) { return $matches[$TabOccurrence] }
        return $null
    }
    if ($matches.Count -gt 1) {
        throw "Multiple visible controls match '$Name'; refusing ambiguous hand-off verification."
    }
    if ($matches.Count -eq 1) { return $matches[0] }
    return $null
}

function Select-RealTab {
    param([string]$Name)

    $lookupDeadline = [DateTime]::UtcNow.AddSeconds(8)
    do {
        $tab = Find-One $Name ([System.Windows.Automation.ControlType]::TabItem)
        if ($tab) { break }
        Start-Sleep -Milliseconds 250
    } while ([DateTime]::UtcNow -lt $lookupDeadline)
    if (-not $tab) {
        throw "The retained browser tab '$Name' was not found."
    }

    try {
        $tab.GetCurrentPattern(
            [System.Windows.Automation.ScrollItemPattern]::Pattern
        ).ScrollIntoView()
    } catch {
        # A visible tab does not require scrolling.
    }

    $selection = $tab.GetCurrentPattern(
        [System.Windows.Automation.SelectionItemPattern]::Pattern
    )
    if (-not $selection.Current.IsSelected) {
        $selection.Select()
    }
    # Chromium can expose the previous accessibility state briefly after selection.
    # Reacquire the element and require its corresponding visible panel as well.
    $deadline = [DateTime]::UtcNow.AddSeconds(8)
    do {
        Start-Sleep -Milliseconds 200
        $fresh = Find-One $Name ([System.Windows.Automation.ControlType]::TabItem)
        if ($fresh) {
            $selected = $fresh.GetCurrentPattern(
                [System.Windows.Automation.SelectionItemPattern]::Pattern
            ).Current.IsSelected
            $panel = Find-One $Name ([System.Windows.Automation.ControlType]::Pane)
            if ($selected -and $panel -and -not $panel.Current.IsOffscreen) {
                $script:SelectedTabIdentity = $fresh.GetRuntimeId() -join ':'
                return
            }
        }
    } while ([DateTime]::UtcNow -lt $deadline)
    throw "The retained browser tab '$Name' did not become selected within 8 seconds."
}

function Read-BrowserUrl {
    $address = Find-One 'Search or enter a URL' ([System.Windows.Automation.ControlType]::ComboBox)
    if (-not $address) {
        throw 'The real browser address control was not found.'
    }
    return $address.GetCurrentPattern([System.Windows.Automation.ValuePattern]::Pattern).Current.Value
}

function Find-Spinner {
    param([string]$Name)
    return Find-One $Name ([System.Windows.Automation.ControlType]::Spinner)
}

function Read-Spinner {
    param($Spinner)
    return $Spinner.GetCurrentPattern(
        [System.Windows.Automation.ValuePattern]::Pattern
    ).Current.Value
}

function Set-Spinner {
    param(
        $Spinner,
        [string]$Value
    )

    $Spinner.GetCurrentPattern(
        [System.Windows.Automation.ValuePattern]::Pattern
    ).SetValue($Value)
}

function Ensure-DeviceToolbar {
    if (Find-Spinner 'Viewport width') {
        return
    }

    $options = Find-One 'Browser options' (
        [System.Windows.Automation.ControlType]::Button
    )
    if (-not $options) {
        throw 'The Browser options button was not found.'
    }

    $expand = $options.GetCurrentPattern(
        [System.Windows.Automation.ExpandCollapsePattern]::Pattern
    )
    if (
        $expand.Current.ExpandCollapseState -ne
        [System.Windows.Automation.ExpandCollapseState]::Expanded
    ) {
        $expand.Expand()
    }
    Start-Sleep -Milliseconds 500

    $showToolbar = Find-One 'Show device toolbar' (
        [System.Windows.Automation.ControlType]::MenuItem
    )
    if (-not $showToolbar) {
        throw 'Show device toolbar was not found in Browser options.'
    }

    $showToolbar.GetCurrentPattern(
        [System.Windows.Automation.InvokePattern]::Pattern
    ).Invoke()
    Start-Sleep -Milliseconds 800

    if (-not (Find-Spinner 'Viewport width')) {
        throw 'The device toolbar did not become available.'
    }
}

Select-RealTab $TabName
$targetTabIdentity = $script:SelectedTabIdentity
$initialUrl = Read-BrowserUrl
if ($ExpectedUrl -and ($initialUrl -replace '^https?://', '') -ne ($ExpectedUrl -replace '^https?://', '')) {
    throw "The retained tab URL '$initialUrl' does not match '$ExpectedUrl'."
}
Ensure-DeviceToolbar

$widthSpinner = Find-Spinner 'Viewport width'
$heightSpinner = Find-Spinner 'Viewport height'
if (-not $widthSpinner -or -not $heightSpinner) {
    throw 'Both viewport controls were not available.'
}

$before = "$(Read-Spinner $widthSpinner)x$(Read-Spinner $heightSpinner)"

Set-Spinner $widthSpinner ([string]$Width)
Set-Spinner $heightSpinner ([string]$Height)
Start-Sleep -Milliseconds 600

$after = "$(Read-Spinner (Find-Spinner 'Viewport width'))x$(Read-Spinner (Find-Spinner 'Viewport height'))"

if (-not $VerificationTab) {
    $tabs = $window.FindAll(
        [System.Windows.Automation.TreeScope]::Descendants,
        (New-Object System.Windows.Automation.PropertyCondition(
            [System.Windows.Automation.AutomationElement]::ControlTypeProperty,
            [System.Windows.Automation.ControlType]::TabItem
        ))
    )
    $VerificationTab = $tabs |
        Where-Object { $_.Current.Name -and $_.Current.Name -ne $TabName } |
        Select-Object -First 1 |
        ForEach-Object { $_.Current.Name }
}

if (-not $VerificationTab) {
    throw 'A second retained tab is required for switch-away verification.'
}

Select-RealTab $VerificationTab
if ($script:SelectedTabIdentity -eq $targetTabIdentity) {
    throw 'Switch-away verification selected the original tab; a distinct real tab is required.'
}
Select-RealTab $TabName
if ($script:SelectedTabIdentity -ne $targetTabIdentity) {
    throw 'The returned tab is not the same real tab that was sized.'
}
$verifiedUrl = Read-BrowserUrl
if ($verifiedUrl -ne $initialUrl) {
    throw "The retained tab URL changed after switching: '$initialUrl' to '$verifiedUrl'."
}

$verifiedWidth = Read-Spinner (Find-Spinner 'Viewport width')
$verifiedHeight = Read-Spinner (Find-Spinner 'Viewport height')
$verified = "${verifiedWidth}x${verifiedHeight}"
$expected = "${Width}x${Height}"

if ($verified -ne $expected) {
    throw "The retained '$TabName' tab returned as $verified, expected $expected."
}

[pscustomobject]@{
    Tab = $TabName
    Before = $before
    After = $after
    VerifiedAfterSwitch = $verified
    VerificationTab = $VerificationTab
    VerifiedUrl = $verifiedUrl
    VisibleControlsOnly = $true
    SameTabIdentityAfterSwitch = $true
}
