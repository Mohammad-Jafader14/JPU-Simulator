/** Keeps the test UI out of normal navigation; see access.js for its limitation. */
import { TEST_ACCESS_KEY } from "./access.js";

if (sessionStorage.getItem(TEST_ACCESS_KEY) !== "granted") window.location.replace("settings.html");
