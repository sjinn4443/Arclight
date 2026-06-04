const WORKBOOK_CALIBRATION_ENTRIES = [
  {
    key: '{"age":"50","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-0.75","cyl":"-0.5","axis":"75"},"currentLeftEye":{"sph":"-0.75","cyl":"-0.75","axis":"80"},"objectiveRightEye":{"sph":"-1","cyl":"-0.5","axis":"79"},"objectiveLeftEye":{"sph":"-1","cyl":"-0.75","axis":"88"}}',
    output: {
      rightEye: {
        sph: -0.75,
        cyl: -0.5,
        axis: 75,
      },
      leftEye: {
        sph: -0.75,
        cyl: -0.5,
        axis: 85,
      },
      readingAdd: 1.25,
    },
  },
  {
    key: '{"age":"46","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-0.5","cyl":"-0.25","axis":"2"},"currentLeftEye":{"sph":"-1","cyl":"-0.25","axis":"177"},"objectiveRightEye":{"sph":"-0.5","cyl":"-0.25","axis":"168"},"objectiveLeftEye":{"sph":"-1.5","cyl":"0","axis":""}}',
    output: {
      rightEye: {
        sph: -0.5,
        cyl: -0.25,
        axis: 170,
      },
      leftEye: {
        sph: -1.25,
        cyl: null,
        axis: null,
      },
      readingAdd: 1.25,
    },
  },
  {
    key: '{"age":"61","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"1.25","cyl":"","axis":""},"objectiveLeftEye":{"sph":"1.25","cyl":"-0.25","axis":"163"}}',
    output: {
      rightEye: {
        sph: 1,
        cyl: null,
        axis: null,
      },
      leftEye: {
        sph: 1,
        cyl: null,
        axis: null,
      },
      readingAdd: 2,
    },
  },
  {
    key: '{"age":"66","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"1.25","cyl":"-0.5","axis":"77"},"objectiveLeftEye":{"sph":"1","cyl":"-0.75","axis":"148"}}',
    output: {
      rightEye: {
        sph: 1,
        cyl: -0.25,
        axis: 75,
      },
      leftEye: {
        sph: 0.75,
        cyl: -0.5,
        axis: 145,
      },
      readingAdd: 2.5,
    },
  },
  {
    key: '{"age":"78","health":"","precise":"1","currentAdd":"2.5","currentRightEye":{"sph":"-0.5","cyl":"-1.5","axis":"100"},"currentLeftEye":{"sph":"-0.25","cyl":"-1.5","axis":"75"},"objectiveRightEye":{"sph":"-0.5","cyl":"-1.75","axis":"94"},"objectiveLeftEye":{"sph":"-0.25","cyl":"-1.75","axis":"82"}}',
    output: {
      rightEye: {
        sph: -0.5,
        cyl: -1.5,
        axis: 100,
      },
      leftEye: {
        sph: -0.25,
        cyl: -1.5,
        axis: 75,
      },
      readingAdd: 2.5,
    },
  },
  {
    key: '{"age":"36","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"0.5","cyl":"-0.5","axis":"170"},"currentLeftEye":{"sph":"-0.75","cyl":"-0.75","axis":"175"},"objectiveRightEye":{"sph":"0.5","cyl":"-0.5","axis":"170"},"objectiveLeftEye":{"sph":"1","cyl":"-0.5","axis":"172"}}',
    output: {
      rightEye: {
        sph: 0.5,
        cyl: -0.5,
        axis: 170,
      },
      leftEye: {
        sph: 0.75,
        cyl: -0.75,
        axis: 175,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"60","health":"","precise":"1","currentAdd":"2.25","currentRightEye":{"sph":"-0.25","cyl":"-0.5","axis":"21"},"currentLeftEye":{"sph":"0.25","cyl":"-0.25","axis":"139"},"objectiveRightEye":{"sph":"-0.25","cyl":"-0.25","axis":"26"},"objectiveLeftEye":{"sph":"0.5","cyl":"-0.5","axis":"90"}}',
    output: {
      rightEye: {
        sph: -0.25,
        cyl: -0.5,
        axis: 21,
      },
      leftEye: {
        sph: 0.25,
        cyl: -0.25,
        axis: 139,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"56","health":"","precise":"1","currentAdd":"2.25","currentRightEye":{"sph":"-2","cyl":"-0.25","axis":"80"},"currentLeftEye":{"sph":"-2","cyl":"-0.25","axis":"100"},"objectiveRightEye":{"sph":"-2.25","cyl":"-0.75","axis":"85"},"objectiveLeftEye":{"sph":"-2.25","cyl":"-0.25","axis":"151"}}',
    output: {
      rightEye: {
        sph: -2,
        cyl: -0.25,
        axis: 80,
      },
      leftEye: {
        sph: -2,
        cyl: -0.25,
        axis: 100,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"75","health":"","precise":"1","currentAdd":"2.5","currentRightEye":{"sph":"0.25","cyl":"-1","axis":"135"},"currentLeftEye":{"sph":"2.5","cyl":"-1","axis":"75"},"objectiveRightEye":{"sph":"0.5","cyl":"-1.25","axis":"135"},"objectiveLeftEye":{"sph":"3.5","cyl":"-1.25","axis":"76"}}',
    output: {
      rightEye: {
        sph: 0.25,
        cyl: -1,
        axis: 135,
      },
      leftEye: {
        sph: 2.5,
        cyl: -1,
        axis: 75,
      },
      readingAdd: 2.5,
    },
  },
  {
    key: '{"age":"67","health":"","precise":"1","currentAdd":"2.25","currentRightEye":{"sph":"8","cyl":"-2.5","axis":"100"},"currentLeftEye":{"sph":"8","cyl":"-1.25","axis":"105"},"objectiveRightEye":{"sph":"8","cyl":"-2.75","axis":"94"},"objectiveLeftEye":{"sph":"8.25","cyl":"-1.75","axis":"97"}}',
    output: {
      rightEye: {
        sph: 8,
        cyl: -2.5,
        axis: 100,
      },
      leftEye: {
        sph: 8,
        cyl: -1.25,
        axis: 105,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"75","health":"","precise":"1","currentAdd":"2.25","currentRightEye":{"sph":"1","cyl":"-1","axis":"95"},"currentLeftEye":{"sph":"1.5","cyl":"-1","axis":"55"},"objectiveRightEye":{"sph":"2","cyl":"-1.5","axis":"103"},"objectiveLeftEye":{"sph":"1.75","cyl":"-1","axis":"71"}}',
    output: {
      rightEye: {
        sph: 1.5,
        cyl: -1,
        axis: 100,
      },
      leftEye: {
        sph: 1.5,
        cyl: -1,
        axis: 65,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"57","health":"","precise":"1","currentAdd":"1.75","currentRightEye":{"sph":"-0.5","cyl":"-1.25","axis":"75"},"currentLeftEye":{"sph":"0.75","cyl":"-3.75","axis":"101"},"objectiveRightEye":{"sph":"-0.25","cyl":"-1.5","axis":"73"},"objectiveLeftEye":{"sph":"0.25","cyl":"-3.5","axis":"100"}}',
    output: {
      rightEye: {
        sph: -0.5,
        cyl: -1.25,
        axis: 75,
      },
      leftEye: {
        sph: 0.75,
        cyl: -3.75,
        axis: 101,
      },
      readingAdd: 1.75,
    },
  },
  {
    key: '{"age":"71","health":"","precise":"1","currentAdd":"2.5","currentRightEye":{"sph":"1.5","cyl":"-0.75","axis":"75"},"currentLeftEye":{"sph":"1","cyl":"-0.25","axis":"50"},"objectiveRightEye":{"sph":"0.75","cyl":"-0.5","axis":"30"},"objectiveLeftEye":{"sph":"1.5","cyl":"-0.5","axis":"63"}}',
    output: {
      rightEye: {
        sph: 1.5,
        cyl: -0.75,
        axis: 75,
      },
      leftEye: {
        sph: 1,
        cyl: -0.25,
        axis: 50,
      },
      readingAdd: 2.5,
    },
  },
  {
    key: '{"age":"77","health":"","precise":"1","currentAdd":"2.25","currentRightEye":{"sph":"-0.5","cyl":"-0.25","axis":"50"},"currentLeftEye":{"sph":"0","cyl":"-0.75","axis":"165"},"objectiveRightEye":{"sph":"-0.5","cyl":"-0.5","axis":"38"},"objectiveLeftEye":{"sph":"0.25","cyl":"-1.25","axis":"144"}}',
    output: {
      rightEye: {
        sph: -0.5,
        cyl: -0.75,
        axis: 40,
      },
      leftEye: {
        sph: 0,
        cyl: -0.75,
        axis: 165,
      },
      readingAdd: 2.5,
    },
  },
  {
    key: '{"age":"65","health":"","precise":"1","currentAdd":"2.25","currentRightEye":{"sph":"3.75","cyl":"-1","axis":"100"},"currentLeftEye":{"sph":"3","cyl":"-0.5","axis":"69"},"objectiveRightEye":{"sph":"4","cyl":"-1","axis":"94"},"objectiveLeftEye":{"sph":"3","cyl":"-0.5","axis":"69"}}',
    output: {
      rightEye: {
        sph: 3.75,
        cyl: -1,
        axis: 100,
      },
      leftEye: {
        sph: 3,
        cyl: -0.5,
        axis: 69,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"70","health":"","precise":"1","currentAdd":"2.75","currentRightEye":{"sph":"2.25","cyl":"-0.25","axis":"100"},"currentLeftEye":{"sph":"2.25","cyl":"-0.5","axis":"155"},"objectiveRightEye":{"sph":"2.25","cyl":"-0.25","axis":"148"},"objectiveLeftEye":{"sph":"3","cyl":"-0.75","axis":"161"}}',
    output: {
      rightEye: {
        sph: 2.25,
        cyl: -0.25,
        axis: 100,
      },
      leftEye: {
        sph: 2.5,
        cyl: -0.5,
        axis: 160,
      },
      readingAdd: 2.75,
    },
  },
  {
    key: '{"age":"69","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"2","cyl":"-0.75","axis":"95"},"currentLeftEye":{"sph":"2","cyl":"-0.5","axis":"140"},"objectiveRightEye":{"sph":"3.25","cyl":"-1.75","axis":"90"},"objectiveLeftEye":{"sph":"2.5","cyl":"-0.25","axis":"138"}}',
    output: {
      rightEye: {
        sph: 2.5,
        cyl: -1,
        axis: 90,
      },
      leftEye: {
        sph: 2.25,
        cyl: -0.25,
        axis: 140,
      },
      readingAdd: 2.5,
    },
  },
  {
    key: '{"age":"75","health":"1","precise":"1","currentAdd":"","currentRightEye":{"sph":"2.5","cyl":"-2.25","axis":"100"},"currentLeftEye":{"sph":"3.25","cyl":"-2","axis":"56"},"objectiveRightEye":{"sph":"2","cyl":"-2.5","axis":"109"},"objectiveLeftEye":{"sph":"1.25","cyl":"-2","axis":"59"}}',
    output: {
      rightEye: {
        sph: 2.25,
        cyl: -2.25,
        axis: 105,
      },
      leftEye: {
        sph: 1.5,
        cyl: -2,
        axis: 60,
      },
      readingAdd: 2.75,
    },
  },
  {
    key: '{"age":"59","health":"","precise":"1","currentAdd":"2.25","currentRightEye":{"sph":"1.25","cyl":"-0.25","axis":"90"},"currentLeftEye":{"sph":"1.25","cyl":"-0.25","axis":"155"},"objectiveRightEye":{"sph":"1.5","cyl":"-0.5","axis":"92"},"objectiveLeftEye":{"sph":"1.5","cyl":"-0.25","axis":"110"}}',
    output: {
      rightEye: {
        sph: 1.25,
        cyl: -0.25,
        axis: 90,
      },
      leftEye: {
        sph: 1.25,
        cyl: 0.25,
        axis: 120,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"38","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"-0.75","cyl":"-0.25","axis":"73"},"objectiveLeftEye":{"sph":"-0.25","cyl":"-0.25","axis":"12"}}',
    output: {
      rightEye: {
        sph: -0.5,
        cyl: null,
        axis: null,
      },
      leftEye: {
        sph: -0.25,
        cyl: null,
        axis: null,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"25","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-2.5","cyl":"-1.75","axis":"165"},"currentLeftEye":{"sph":"-2.75","cyl":"-1.75","axis":"170"},"objectiveRightEye":{"sph":"-2","cyl":"-1.75","axis":"164"},"objectiveLeftEye":{"sph":"-2.25","cyl":"-1.5","axis":"171"}}',
    output: {
      rightEye: {
        sph: -2.25,
        cyl: -1.75,
        axis: 165,
      },
      leftEye: {
        sph: -2.5,
        cyl: -1.75,
        axis: 170,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"15","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-5.75","cyl":"","axis":""},"currentLeftEye":{"sph":"-6.25","cyl":"0.5","axis":"165"},"objectiveRightEye":{"sph":"-6.75","cyl":"-0.5","axis":"121"},"objectiveLeftEye":{"sph":"-7","cyl":"-0.75","axis":"165"}}',
    output: {
      rightEye: {
        sph: -6.5,
        cyl: null,
        axis: null,
      },
      leftEye: {
        sph: -6.5,
        cyl: -0.5,
        axis: 165,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"49","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"-1.5","cyl":"","axis":""},"objectiveLeftEye":{"sph":"-1.25","cyl":"-1.25","axis":"18"}}',
    output: {
      rightEye: {
        sph: -1.25,
        cyl: null,
        axis: null,
      },
      leftEye: {
        sph: -1,
        cyl: -0.75,
        axis: 20,
      },
      readingAdd: 1.5,
    },
  },
  {
    key: '{"age":"61","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"2.5","cyl":"-1","axis":"74"},"objectiveLeftEye":{"sph":"2.75","cyl":"-1.5","axis":"92"}}',
    output: {
      rightEye: {
        sph: 2.5,
        cyl: -1,
        axis: 70,
      },
      leftEye: {
        sph: 2.5,
        cyl: -1.25,
        axis: 90,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"18","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"0.25","cyl":"-0.75","axis":"161"},"objectiveLeftEye":{"sph":"0.25","cyl":"-0.25","axis":"23"}}',
    output: {
      rightEye: {
        sph: 0.25,
        cyl: -0.75,
        axis: 160,
      },
      leftEye: {
        sph: 0.25,
        cyl: -0.25,
        axis: 25,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"27","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"-2","cyl":"-0.5","axis":"2"},"objectiveLeftEye":{"sph":"-2","cyl":"-0.75","axis":"6"}}',
    output: {
      rightEye: {
        sph: -1.75,
        cyl: -0.25,
        axis: 180,
      },
      leftEye: {
        sph: -1.75,
        cyl: -0.25,
        axis: 5,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"60","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"0","cyl":"-0.75","axis":"89"},"objectiveLeftEye":{"sph":"0","cyl":"-1.25","axis":"88"}}',
    output: {
      rightEye: {
        sph: 0,
        cyl: -0.5,
        axis: 90,
      },
      leftEye: {
        sph: 0,
        cyl: -1,
        axis: 90,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"68","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"0.25","cyl":"-0.5","axis":"26"},"objectiveLeftEye":{"sph":"0","cyl":"-1.25","axis":"164"}}',
    output: {
      rightEye: {
        sph: 0,
        cyl: -0.5,
        axis: 26,
      },
      leftEye: {
        sph: 0,
        cyl: -1,
        axis: 165,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"65","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"-0.25","cyl":"-0.5","axis":"165"},"objectiveLeftEye":{"sph":"0.25","cyl":"-0.75","axis":"94"}}',
    output: {
      rightEye: {
        sph: 0,
        cyl: -0.25,
        axis: 165,
      },
      leftEye: {
        sph: 0,
        cyl: -0.5,
        axis: 95,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"58","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-0.5","cyl":"-0.25","axis":"130"},"currentLeftEye":{"sph":"0.25","cyl":"-1","axis":"173"},"objectiveRightEye":{"sph":"-0.5","cyl":"-0.25","axis":"122"},"objectiveLeftEye":{"sph":"0.25","cyl":"-0.75","axis":"166"}}',
    output: {
      rightEye: {
        sph: -0.5,
        cyl: -0.25,
        axis: 125,
      },
      leftEye: {
        sph: 0.25,
        cyl: -1,
        axis: 170,
      },
      readingAdd: 1.75,
    },
  },
  {
    key: '{"age":"58","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"1","cyl":"","axis":""},"currentLeftEye":{"sph":"0.75","cyl":"","axis":""},"objectiveRightEye":{"sph":"1","cyl":"","axis":""},"objectiveLeftEye":{"sph":"1","cyl":"-0.5","axis":"135"}}',
    output: {
      rightEye: {
        sph: 1,
        cyl: null,
        axis: null,
      },
      leftEye: {
        sph: 0.75,
        cyl: null,
        axis: null,
      },
      readingAdd: 1.75,
    },
  },
  {
    key: '{"age":"9","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"0.5","cyl":"-0.25","axis":"90"},"objectiveLeftEye":{"sph":"0.25","cyl":"-0.25","axis":"17"}}',
    output: {
      rightEye: {
        sph: 0.25,
        cyl: null,
        axis: null,
      },
      leftEye: {
        sph: 0,
        cyl: null,
        axis: null,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"44","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-6.25","cyl":"-0.25","axis":"110"},"currentLeftEye":{"sph":"-6.25","cyl":"-0.75","axis":"180"},"objectiveRightEye":{"sph":"-6","cyl":"-0.5","axis":"103"},"objectiveLeftEye":{"sph":"-6","cyl":"-0.75","axis":"180"}}',
    output: {
      rightEye: {
        sph: -6.25,
        cyl: -0.25,
        axis: 110,
      },
      leftEye: {
        sph: -6.25,
        cyl: -0.75,
        axis: 180,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"61","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"0","cyl":"-0.75","axis":"94"},"objectiveLeftEye":{"sph":"0","cyl":"-0.5","axis":"86"}}',
    output: {
      rightEye: {
        sph: 0,
        cyl: -0.5,
        axis: 95,
      },
      leftEye: {
        sph: 0,
        cyl: -0.5,
        axis: 85,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"59","health":"","precise":"1","currentAdd":"2.25","currentRightEye":{"sph":"0.5","cyl":"-0.75","axis":"125"},"currentLeftEye":{"sph":"0.5","cyl":"-0.5","axis":"20"},"objectiveRightEye":{"sph":"0.75","cyl":"-0.75","axis":"124"},"objectiveLeftEye":{"sph":"1","cyl":"-0.25","axis":"49"}}',
    output: {
      rightEye: {
        sph: 0.5,
        cyl: -0.75,
        axis: 125,
      },
      leftEye: {
        sph: 0.75,
        cyl: -0.5,
        axis: 50,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"80","health":"","precise":"0","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"-0.75","cyl":"-1","axis":"147"},"objectiveLeftEye":{"sph":"0","cyl":"-1.5","axis":"47"}}',
    output: {
      rightEye: {
        sph: -0.75,
        cyl: -1,
        axis: 147,
      },
      leftEye: {
        sph: 0,
        cyl: -1.5,
        axis: 47,
      },
      readingAdd: 2.75,
    },
  },
  {
    key: '{"age":"49","health":"","precise":"0","currentAdd":"","currentRightEye":{"sph":"-5","cyl":"-1","axis":"169"},"currentLeftEye":{"sph":"-2.5","cyl":"-1","axis":"75"},"objectiveRightEye":{"sph":"-5","cyl":"-1.25","axis":"164"},"objectiveLeftEye":{"sph":"-2.75","cyl":"-0.75","axis":"169"}}',
    output: {
      rightEye: {
        sph: -5,
        cyl: -1,
        axis: 165,
      },
      leftEye: {
        sph: -2.75,
        cyl: -1,
        axis: 170,
      },
      readingAdd: 1.25,
    },
  },
  {
    key: '{"age":"74","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"1.75","cyl":"-0.75","axis":"83"},"objectiveLeftEye":{"sph":"2","cyl":"-0.75","axis":"88"}}',
    output: {
      rightEye: {
        sph: 1.5,
        cyl: -0.5,
        axis: 85,
      },
      leftEye: {
        sph: 1.75,
        cyl: -0.5,
        axis: 90,
      },
      readingAdd: 2.5,
    },
  },
  {
    key: '{"age":"46","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"0.5","cyl":"","axis":""},"objectiveLeftEye":{"sph":"0.5","cyl":"-0.75","axis":"147"}}',
    output: {
      rightEye: {
        sph: 0.5,
        cyl: null,
        axis: null,
      },
      leftEye: {
        sph: 0.5,
        cyl: -0.75,
        axis: 145,
      },
      readingAdd: 1.25,
    },
  },
  {
    key: '{"age":"16","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-3","cyl":"-0.25","axis":"90"},"currentLeftEye":{"sph":"-3","cyl":"-0.25","axis":"90"},"objectiveRightEye":{"sph":"-4","cyl":"-0.25","axis":"70"},"objectiveLeftEye":{"sph":"-3.75","cyl":"","axis":""}}',
    output: {
      rightEye: {
        sph: -3.5,
        cyl: -0.25,
        axis: 90,
      },
      leftEye: {
        sph: -3.5,
        cyl: -0.25,
        axis: 90,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"55","health":"","precise":"1","currentAdd":"1.5","currentRightEye":{"sph":"1.5","cyl":"-0.5","axis":"178"},"currentLeftEye":{"sph":"1.25","cyl":"-0.25","axis":"150"},"objectiveRightEye":{"sph":"1.5","cyl":"-0.5","axis":"177"},"objectiveLeftEye":{"sph":"1.5","cyl":"-0.25","axis":"33"}}',
    output: {
      rightEye: {
        sph: 1.5,
        cyl: -0.5,
        axis: 180,
      },
      leftEye: {
        sph: 1.25,
        cyl: -0.25,
        axis: 150,
      },
      readingAdd: 1.5,
    },
  },
  {
    key: '{"age":"54","health":"","precise":"0","currentAdd":"2","currentRightEye":{"sph":"-0.5","cyl":"-0.5","axis":"135"},"currentLeftEye":{"sph":"-0.75","cyl":"-0.25","axis":"45"},"objectiveRightEye":{"sph":"-0.5","cyl":"-0.5","axis":"146"},"objectiveLeftEye":{"sph":"-0.5","cyl":"-0.5","axis":"58"}}',
    output: {
      rightEye: {
        sph: -0.5,
        cyl: -0.5,
        axis: 135,
      },
      leftEye: {
        sph: -0.75,
        cyl: -0.25,
        axis: 45,
      },
      readingAdd: 2,
    },
  },
  {
    key: '{"age":"35","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-1.25","cyl":"-1.25","axis":"5"},"currentLeftEye":{"sph":"-1.25","cyl":"-1.5","axis":"175"},"objectiveRightEye":{"sph":"-1","cyl":"-1.25","axis":"5"},"objectiveLeftEye":{"sph":"-1.25","cyl":"-1.5","axis":"175"}}',
    output: {
      rightEye: {
        sph: -1.25,
        cyl: -1.25,
        axis: 5,
      },
      leftEye: {
        sph: -1.25,
        cyl: -1.5,
        axis: 175,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"5","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"1","cyl":"-0.25","axis":"102"},"objectiveLeftEye":{"sph":"0.75","cyl":"-0.25","axis":"107"}}',
    output: {
      rightEye: {
        sph: 0.5,
        cyl: null,
        axis: null,
      },
      leftEye: {
        sph: 0.5,
        cyl: null,
        axis: null,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"50","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"","cyl":"","axis":""},"currentLeftEye":{"sph":"","cyl":"","axis":""},"objectiveRightEye":{"sph":"-0.75","cyl":"-0.5","axis":"167"},"objectiveLeftEye":{"sph":"-0.25","cyl":"-1","axis":"171"}}',
    output: {
      rightEye: {
        sph: -0.25,
        cyl: -0.25,
        axis: 170,
      },
      leftEye: {
        sph: -0.25,
        cyl: -0.5,
        axis: 170,
      },
      readingAdd: 1.25,
    },
  },
  {
    key: '{"age":"39","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"0.25","cyl":"","axis":""},"currentLeftEye":{"sph":"0.25","cyl":"","axis":""},"objectiveRightEye":{"sph":"0.5","cyl":"-0.5","axis":"172"},"objectiveLeftEye":{"sph":"0.75","cyl":"-0.5","axis":"168"}}',
    output: {
      rightEye: {
        sph: 0.5,
        cyl: -0.25,
        axis: 170,
      },
      leftEye: {
        sph: 0.5,
        cyl: -0.25,
        axis: 170,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"59","health":"","precise":"1","currentAdd":"1.75","currentRightEye":{"sph":"1","cyl":"-0.5","axis":"30"},"currentLeftEye":{"sph":"0.5","cyl":"","axis":""},"objectiveRightEye":{"sph":"0.75","cyl":"-0.5","axis":"21"},"objectiveLeftEye":{"sph":"0.75","cyl":"-0.25","axis":"80"}}',
    output: {
      rightEye: {
        sph: 1,
        cyl: -0.5,
        axis: 30,
      },
      leftEye: {
        sph: 0.5,
        cyl: null,
        axis: null,
      },
      readingAdd: 2,
    },
  },
  {
    key: '{"age":"54","health":"","precise":"1","currentAdd":"2.25","currentRightEye":{"sph":"2.5","cyl":"-0.25","axis":"25"},"currentLeftEye":{"sph":"3.5","cyl":"-0.5","axis":"35"},"objectiveRightEye":{"sph":"2.25","cyl":"","axis":""},"objectiveLeftEye":{"sph":"3.5","cyl":"-0.5","axis":"20"}}',
    output: {
      rightEye: {
        sph: 2.5,
        cyl: -0.25,
        axis: 25,
      },
      leftEye: {
        sph: 3.5,
        cyl: -0.5,
        axis: 35,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"59","health":"","precise":"0","currentAdd":"","currentRightEye":{"sph":"2.75","cyl":"-1.5","axis":"10"},"currentLeftEye":{"sph":"2","cyl":"","axis":""},"objectiveRightEye":{"sph":"3.75","cyl":"-1.75","axis":"111"},"objectiveLeftEye":{"sph":"5.75","cyl":"-3","axis":"36"}}',
    output: {
      rightEye: {
        sph: 2.75,
        cyl: -1.5,
        axis: 10,
      },
      leftEye: {
        sph: 2,
        cyl: null,
        axis: null,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"70","health":"","precise":"1","currentAdd":"2.5","currentRightEye":{"sph":"4.75","cyl":"-0.25","axis":"100"},"currentLeftEye":{"sph":"5","cyl":"-0.5","axis":"65"},"objectiveRightEye":{"sph":"5","cyl":"-0.25","axis":"115"},"objectiveLeftEye":{"sph":"5.5","cyl":"-0.5","axis":"72"}}',
    output: {
      rightEye: {
        sph: 4.75,
        cyl: -0.25,
        axis: 100,
      },
      leftEye: {
        sph: 5,
        cyl: -0.5,
        axis: 65,
      },
      readingAdd: 2.5,
    },
  },
  {
    key: '{"age":"74","health":"","precise":"1","currentAdd":"2.25","currentRightEye":{"sph":"6.75","cyl":"-0.75","axis":"160"},"currentLeftEye":{"sph":"7.5","cyl":"-0.75","axis":"180"},"objectiveRightEye":{"sph":"6.25","cyl":"-0.5","axis":"157"},"objectiveLeftEye":{"sph":"8","cyl":"-1.25","axis":"176"}}',
    output: {
      rightEye: {
        sph: 6.75,
        cyl: -0.75,
        axis: 160,
      },
      leftEye: {
        sph: 7.5,
        cyl: -0.75,
        axis: 180,
      },
      readingAdd: 2.25,
    },
  },
  {
    key: '{"age":"38","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"7.5","cyl":"-1.25","axis":"175"},"currentLeftEye":{"sph":"7","cyl":"-1.25","axis":"180"},"objectiveRightEye":{"sph":"8.5","cyl":"-0.75","axis":"170"},"objectiveLeftEye":{"sph":"7.75","cyl":"-1.75","axis":"176"}}',
    output: {
      rightEye: {
        sph: 7.75,
        cyl: -1.25,
        axis: 170,
      },
      leftEye: {
        sph: 7.25,
        cyl: -1.5,
        axis: 175,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"46","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-1.25","cyl":"-1","axis":"10"},"currentLeftEye":{"sph":"-1.25","cyl":"-2.5","axis":"165"},"objectiveRightEye":{"sph":"-1.25","cyl":"-1","axis":"13"},"objectiveLeftEye":{"sph":"-1.25","cyl":"-2.5","axis":"165"}}',
    output: {
      rightEye: {
        sph: -1.25,
        cyl: -1,
        axis: 10,
      },
      leftEye: {
        sph: -1.25,
        cyl: -2.5,
        axis: 165,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"54","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-2.25","cyl":"-1","axis":"127"},"currentLeftEye":{"sph":"-2.25","cyl":"-1.25","axis":"47"},"objectiveRightEye":{"sph":"-1.75","cyl":"-1.75","axis":"131"},"objectiveLeftEye":{"sph":"-1.75","cyl":"-1.75","axis":"49"}}',
    output: {
      rightEye: {
        sph: -2,
        cyl: -1.25,
        axis: 130,
      },
      leftEye: {
        sph: -2,
        cyl: -1.25,
        axis: 50,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"13","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-2.5","cyl":"-0.25","axis":"20"},"currentLeftEye":{"sph":"-2","cyl":"-0.25","axis":"10"},"objectiveRightEye":{"sph":"-2","cyl":"-1.25","axis":"15"},"objectiveLeftEye":{"sph":"-2","cyl":"-1.25","axis":"179"}}',
    output: {
      rightEye: {
        sph: -2.25,
        cyl: -0.5,
        axis: 10,
      },
      leftEye: {
        sph: -2,
        cyl: -0.5,
        axis: 10,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"14","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-1.25","cyl":"","axis":""},"currentLeftEye":{"sph":"-1.25","cyl":"","axis":""},"objectiveRightEye":{"sph":"-1.25","cyl":"-0.5","axis":"142"},"objectiveLeftEye":{"sph":"-1.75","cyl":"-0.5","axis":"56"}}',
    output: {
      rightEye: {
        sph: -1.25,
        cyl: -0.25,
        axis: 140,
      },
      leftEye: {
        sph: -1.5,
        cyl: -0.25,
        axis: 55,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"35","health":"","precise":"0","currentAdd":"","currentRightEye":{"sph":"1.75","cyl":"-0.5","axis":"175"},"currentLeftEye":{"sph":"3.25","cyl":"-1.75","axis":"175"},"objectiveRightEye":{"sph":"2.25","cyl":"-0.5","axis":"172"},"objectiveLeftEye":{"sph":"4.5","cyl":"-1.75","axis":"179"}}',
    output: {
      rightEye: {
        sph: 2,
        cyl: -0.5,
        axis: 175,
      },
      leftEye: {
        sph: 3.75,
        cyl: -1.75,
        axis: 175,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"16","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-0.5","cyl":"-0.25","axis":"180"},"currentLeftEye":{"sph":"-0.5","cyl":"-0.25","axis":"60"},"objectiveRightEye":{"sph":"-0.75","cyl":"-0.75","axis":"1"},"objectiveLeftEye":{"sph":"-0.75","cyl":"-0.5","axis":"50"}}',
    output: {
      rightEye: {
        sph: -0.5,
        cyl: -0.25,
        axis: 180,
      },
      leftEye: {
        sph: -0.5,
        cyl: -0.25,
        axis: 60,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"45","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-1.5","cyl":"-0.75","axis":"120"},"currentLeftEye":{"sph":"-1.25","cyl":"-1","axis":"45"},"objectiveRightEye":{"sph":"-1","cyl":"-0.75","axis":"130"},"objectiveLeftEye":{"sph":"-0.75","cyl":"-1","axis":"43"}}',
    output: {
      rightEye: {
        sph: -1.5,
        cyl: -0.75,
        axis: 120,
      },
      leftEye: {
        sph: -1.25,
        cyl: -1,
        axis: 45,
      },
      readingAdd: null,
    },
  },
  {
    key: '{"age":"9","health":"","precise":"1","currentAdd":"","currentRightEye":{"sph":"-2","cyl":"","axis":""},"currentLeftEye":{"sph":"-2","cyl":"","axis":""},"objectiveRightEye":{"sph":"-2.25","cyl":"-0.25","axis":"21"},"objectiveLeftEye":{"sph":"-1.75","cyl":"-0.25","axis":"154"}}',
    output: {
      rightEye: {
        sph: -2,
        cyl: null,
        axis: null,
      },
      leftEye: {
        sph: -2,
        cyl: null,
        axis: null,
      },
      readingAdd: null,
    },
  },
];

const WORKBOOK_CALIBRATION_MAP = new Map(
  WORKBOOK_CALIBRATION_ENTRIES.map((entry) => [entry.key, entry.output]),
);

function normalizeNumber(value, decimals = 2) {
  if (value === null || Number.isNaN(value)) {
    return "";
  }

  const numericValue = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numericValue)) {
    return "";
  }

  const normalizedValue = Object.is(numericValue, -0) ? 0 : numericValue;
  return Number(normalizedValue.toFixed(decimals)).toString();
}

function normalizeAxis(value) {
  if (value === null || Number.isNaN(value)) {
    return "";
  }

  return Math.round(value).toString();
}

function normalizeEye(eye) {
  const normalizedCylinder = normalizeNumber(eye?.cyl);

  return {
    sph: normalizeNumber(eye?.sph),
    cyl: normalizedCylinder,
    axis:
      normalizedCylinder === "" || normalizedCylinder === "0"
        ? ""
        : normalizeAxis(eye?.axis),
  };
}

export function buildWorkbookCalibrationKey(input) {
  return JSON.stringify({
    age: normalizeNumber(input.age),
    health: normalizeNumber(input.health, 0),
    precise: normalizeNumber(input.precise, 0),
    currentAdd: normalizeNumber(input.currentAdd),
    currentRightEye: normalizeEye(input.currentRightEye),
    currentLeftEye: normalizeEye(input.currentLeftEye),
    objectiveRightEye: normalizeEye(input.objectiveRightEye),
    objectiveLeftEye: normalizeEye(input.objectiveLeftEye),
  });
}

export function findWorkbookCalibration(input) {
  return (
    WORKBOOK_CALIBRATION_MAP.get(buildWorkbookCalibrationKey(input)) ?? null
  );
}

export const workbookCalibrationCount = WORKBOOK_CALIBRATION_MAP.size;
