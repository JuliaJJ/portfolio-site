import { makePage } from "@keystatic/astro/ui";
import keystaticConfig from "../../keystatic.config";

const KeystaticApp = makePage(keystaticConfig);
export default KeystaticApp;
