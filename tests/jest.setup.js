import dotenv from "dotenv";
import { TextEncoder, TextDecoder } from "util";

dotenv.config();

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
