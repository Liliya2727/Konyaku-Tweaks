/*
 * Copyright (C) 2024-2025 Zexshia
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import BannerZenith from "/EncoreBanner.avif";
import AvatarZenith from "/Avatar.avif";
import SchemeBanner from "/SchemeBanner.avif";
import { exec, toast } from "kernelsu";

const executeCommand = async (cmd, cwd = null) => {
  try {
    const { errno, stdout, stderr } = await exec(cmd, cwd ? { cwd } : {});
    return { errno, stdout, stderr };
  } catch (e) {
    return { errno: -1, stdout: "", stderr: e.message || String(e) };
  }
};

function EventEmitter() {
    this.listeners = {};
}
const randomMessages = [
    "The sky is really pretty today... did you notice?",
    "Sparkles make everything better ✨",
    "You’re doing your best, and that’s enough~",
    "It’s okay to rest. Even stars need time to shine.",
    "A warm drink, a deep breath… everything will be alright.",
    "Soft clouds, quiet hearts. Let’s take it slow today~",
    "You don’t need a reason to smile — just smile~",
    "Even little steps can lead to big dreams~",
    "The wind feels gentle today… like a hug from the world.",
    "You’re like a small flower growing through the cracks — beautiful and brave.",
    "I believe in you~ even if the world feels heavy sometimes.",
    "Let’s chase the light, even if the path is slow.",
    "The stars are always watching… and they’re proud of you.",
    "You sparkle more than you think ✨",
    "Sometimes doing nothing is the bravest thing of all.",
    "Let the sun kiss your cheeks and your worries fade away.",
    "Moonlight doesn’t rush, and neither should you~",
    "Hold my hand, even just in your thoughts~",
    "Gentle mornings start with a smile — even a sleepy one.",
    "Float like a cloud, soft and free~",
    "You’re a soft melody in a world that rushes — take your time.",
    "Cup of tea, cozy socks, and a heart that’s healing~",
    "Rainy days are for dreaming softly under blankets~",
    "Flowers bloom quietly — you will too.",
    "The sky doesn’t ask for permission to be beautiful, and neither should you.",
    "You are made of soft light and quiet courage~",
    "Stargazing isn’t procrastinating — it’s soul-healing.",
    "It's okay to have quiet days. The moon does too.",
    "Today’s vibe: calm skies, warm tea, soft heart.",
    "You don’t have to glow loud — some stars shine in silence ✨",
];
function showRandomMessage() {
    let c = document.getElementById("msg"),
        s = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    c.textContent = s;
}
function Process() {
    (this.listeners = {}), (this.stdin = new EventEmitter()), (this.stdout = new EventEmitter()), (this.stderr = new EventEmitter());
}
function showToast(c) {
    ksu.toast(c);
}
(window.onload = showRandomMessage),
    (EventEmitter.prototype.on = function (c, s) {
        this.listeners[c] || (this.listeners[c] = []), this.listeners[c].push(s);
    }),
    (EventEmitter.prototype.emit = function (c, ...s) {
        this.listeners[c] && this.listeners[c].forEach((c) => c(...s));
    }),
    (Process.prototype.on = function (c, s) {
        this.listeners[c] || (this.listeners[c] = []), this.listeners[c].push(s);
    }),
    (Process.prototype.emit = function (c, ...s) {
        this.listeners[c] && this.listeners[c].forEach((c) => c(...s));
    });
var u = {};
async function checkModuleVersion() {
    try {
        let { errno: c, stdout: s } = await executeCommand("echo 'Version :' && grep \"version=\" /data/adb/modules/Zirelia/module.prop | awk -F'=' '{print $2}'");
        0 === c && (document.getElementById("moduleVer").textContent = s.trim());
    } catch {}
}
async function checkEncoreVer() {
    try {
        let { errno: c, stdout: s } = await executeCommand("echo 'Version :' && grep \"version=\" /data/adb/modules/encore/module.prop | awk -F'=' '{print $2}'");
        0 === c && (document.getElementById("EncoreVer").textContent = s.trim());
    } catch {}
}
async function checkProfile() {
    try {
        let { errno: c, stdout: s } = await executeCommand("cat /data/adb/.config/encore/current_profile");
        if (c === 0) {
            const profileValue = s.trim();
            const profileName = {
                "2": "Normal",
                "1": "Performance",
                "3": "Powersave",
                "0": "Perfcommon"
            }[profileValue] || "Unknown";
            document.getElementById("CurProfile").textContent = profileName;
        }
    } catch (r) {
        console.error("Failed to check Current Profile:", r);
    }
}
let cachedSOCData = null;
async function fetchSOCDatabase() {
    if (!cachedSOCData)
        try {
            cachedSOCData = await (await fetch("/assets/soc.json")).json();
        } catch {
            cachedSOCData = {};
        }
    return cachedSOCData;
}
async function checkCPUInfo() {
    try {
        let { errno: c, stdout: s } = await executeCommand("getprop ro.soc.model");
        if (0 === c) {
            let r = s.trim(),
                d = await fetchSOCDatabase(),
                l = d[r];
            if (!l)
                for (let h = 8; h >= 6; h--) {
                    let m = r.substring(0, h);
                    if (d[m]) {
                        l = d[m];
                        break;
                    }
                }
            (l = l || `MediaTek ${r}`), (document.getElementById("cpuInfo").textContent = l);
        }
    } catch {
        document.getElementById("cpuInfo").textContent = "Error fetching CPU info";
    }
}
async function checkKernelVersion() {
    try {
        let { errno: c, stdout: s } = await executeCommand("uname -r");
        if (0 === c && s.trim()) document.getElementById("kernelInfo").textContent = s.trim();
        else {
            let r = await executeCommand("cat /proc/version");
            0 === r.errno && r.stdout.trim() ? (document.getElementById("kernelInfo").textContent = r.stdout.trim()) : (document.getElementById("kernelInfo").textContent = "Unknown Kernel");
        }
    } catch {
        document.getElementById("kernelInfo").textContent = "Error";
    }
}
async function getAndroidVersion() {
    try {
        let { errno: c, stdout: s } = await executeCommand("echo Android && getprop ro.build.version.release");
        0 === c && (document.getElementById("android").textContent = s.trim());
    } catch {}
}
async function checkServiceStatus() {
    let { errno: c, stdout: s } = await executeCommand("pgrep -f encored");
    if (0 === c) {
        let r = document.getElementById("serviceStatus");
        "0" !== s.trim()
            ? ((r.textContent = "Connected to Encore✨"), (document.getElementById("servicePID").textContent = "Encore PID: " + s.trim()))
            : ((r.textContent = "Sleeping\uD83D\uDCA4"), (document.getElementById("servicePID").textContent = "Encore PID: null"));
    }
}

async function checkBypassChargeStatus() {
    let { errno: c, stdout: s } = await executeCommand("cat /data/adb/.config/zirelia/bypass_charge");
    0 === c && (document.getElementById("Zepass").checked = "1" === s.trim());
}
async function setBypassChargeStatus(c) {
    await executeCommand(c ? "echo 1 >/data/adb/.config/zirelia/bypass_charge" : "echo 0 >/data/adb/.config/zirelia/bypass_charge");
}
async function checkdndStatus() {
    let { errno: c, stdout: s } = await executeCommand("cat /data/adb/.config/encore/dnd_gameplay");
    0 === c && (document.getElementById("dnd").checked = "1" === s.trim());
}
async function setdndStatus(c) {
    await executeCommand(c ? "echo 1 >/data/adb/.config/encore/dnd_gameplay" : "echo 0 >/data/adb/.config/encore/dnd_gameplay");
}
async function checkDThermal() {
    let { errno: c, stdout: s } = await executeCommand("cat /data/adb/.config/zirelia/DThermal");
    0 === c && (document.getElementById("DThermal").checked = "1" === s.trim());
}
async function setDThermal(c) {
    await executeCommand(c ? "echo 1 >/data/adb/.config/zirelia/DThermal" : "echo 0 >/data/adb/.config/zirelia/DThermal");
}
async function checkSFL() {
    let { errno: c, stdout: s } = await executeCommand("cat /data/adb/.config/zirelia/SFL");
    0 === c && (document.getElementById("SFL").checked = "1" === s.trim());
}
async function setSFL(c) {
    await executeCommand(c ? "echo 1 >/data/adb/.config/zirelia/SFL" : "echo 0 >/data/adb/.config/zirelia/SFL");
}
async function checkiosched() {
    let { errno: c, stdout: s } = await executeCommand("cat /data/adb/.config/zirelia/iosched");
    0 === c && (document.getElementById("iosched").checked = "1" === s.trim());
}
async function setiosched(c) {
    await executeCommand(c ? "echo 1 >/data/adb/.config/zirelia/iosched" : "echo 0 >/data/adb/.config/zirelia/iosched");
}
async function checkenctoast() {
    let { errno: c, stdout: s } = await executeCommand("cat /data/adb/.config/zirelia/showtoast");
    0 === c && (document.getElementById("encoretoast").checked = "1" === s.trim());
}
async function setenctoast(c) {
    await executeCommand(c ? "echo 1 >/data/adb/.config/zirelia/showtoast" : "echo 0 >/data/adb/.config/zirelia/showtoast");
}
async function applydisablevsync() {
    await executeCommand("service call SurfaceFlinger 1035 i32 0"), showToast("Applied!");
}
async function checkFSTrim() {
    let { errno: c, stdout: s } = await executeCommand("cat /data/adb/.config/zirelia/FSTrim");
    0 === c && (document.getElementById("FSTrim").checked = "1" === s.trim());
}
async function setFSTrim(c) {
    await executeCommand(c ? "echo 1 >/data/adb/.config/zirelia/FSTrim" : "echo 0 >/data/adb/.config/zirelia/FSTrim");
}
async function checkKillLog() {
    let { errno: c, stdout: s } = await executeCommand("cat /data/adb/.config/zirelia/logd");
    0 === c && (document.getElementById("logd").checked = "1" === s.trim());
}
async function setKillLog(c) {
    await executeCommand(c ? "echo 1 >/data/adb/.config/zirelia/logd" : "echo 0 >/data/adb/.config/zirelia/logd");
}
async function checkGPreload() {
    let { errno: c, stdout: s } = await executeCommand("cat /data/adb/.config/zirelia/APreload");
    0 === c && (document.getElementById("GPreload").checked = "1" === s.trim());
}
async function setGPreloadStatus(c) {
    await executeCommand(c ? "echo 1 >/data/adb/.config/zirelia/APreload" : "echo 0 >/data/adb/.config/zirelia/APreload");
}
async function checkRamBoost() {
    let { errno: c, stdout: s } = await executeCommand("cat /data/adb/.config/zirelia/clearbg");
    0 === c && (document.getElementById("clearbg").checked = "1" === s.trim());
}
async function setRamBoostStatus(c) {
    await executeCommand(c ? "echo 1 >/data/adb/.config/zirelia/clearbg" : "echo 0 >/data/adb/.config/zirelia/clearbg");
}
async function checkfpsged() {
    let { errno: c, stdout: s } = await executeCommand("cat /data/adb/.config/zirelia/fpsged");
    0 === c && (document.getElementById("fpsged").checked = "1" === s.trim());
}
async function setfpsged(c) {
    await executeCommand(c ? "echo 1 >/data/adb/.config/zirelia/fpsged" : "echo 0 >/data/adb/.config/zirelia/fpsged");
}

// Constants
const CACHE_FILE_PATH = "/data/adb/.config/zirelia/color_scheme";

// Write settings to file only
function saveDisplaySettings(red, green, blue, saturation) {
    const cmd = `sh -c 'echo "${red} ${green} ${blue} ${saturation}" > ${CACHE_FILE_PATH}'`;
    executeCommand(cmd);
}


async function loadDisplaySettings() {
    try {
        const result = await executeCommand(`sh -c "cat '${CACHE_FILE_PATH}'"`);

        const content = typeof result === "object" && result.stdout ? result.stdout.trim() : String(result).trim();

        const [red, green, blue, saturation] = content.split(/\s+/).map(Number);

        if ([red, green, blue, saturation].some(isNaN)) {
            showToast("Invalid color_scheme format. Using safe defaults.");
            return { red: 1000, green: 1000, blue: 1000, saturation: 1000 };
        }

        return { red, green, blue, saturation };
    } catch (error) {
        console.log("Error reading display settings:", error);
        showToast("color_scheme not found. Using defaults.");
        return { red: 1000, green: 1000, blue: 1000, saturation: 1000 };
    }
}

// Apply RGB via SurfaceFlinger
async function setRGB(red, green, blue) {
    await executeCommand(
        `service call SurfaceFlinger 1015 i32 1 f ${red / 1000} f 0 f 0 f 0 f 0 f ${green / 1000} f 0 f 0 f 0 f 0 f ${blue / 1000} f 0 f 0 f 0 f 0 f 1`
    );
}

// Apply saturation
async function setSaturation(value) {
    await executeCommand(`service call SurfaceFlinger 1022 f ${value / 1000}`);
}

// Reset display and file
async function resetDisplaySettings() {
    await executeCommand(
        "service call SurfaceFlinger 1015 i32 1 f 1 f 0 f 0 f 0 f 0 f 1 f 0 f 0 f 0 f 0 f 1 f 0 f 0 f 0 f 0 f 1"
    );
    await executeCommand("service call SurfaceFlinger 1022 f 1");
    saveDisplaySettings(1000, 1000, 1000, 1000);

    // Reset UI sliders
    document.getElementById("red").value = 1000;
    document.getElementById("green").value = 1000;
    document.getElementById("blue").value = 1000;
    document.getElementById("saturation").value = 1000;

    showToast("Display settings reset!");
}

// On load
document.addEventListener("DOMContentLoaded", async () => {
    const redInput = document.getElementById("red");
    const greenInput = document.getElementById("green");
    const blueInput = document.getElementById("blue");
    const saturationInput = document.getElementById("saturation");
    const resetButton = document.getElementById("reset-btn");

    // Load and apply saved settings
    const cached = await loadDisplaySettings();

    redInput.value = cached.red;
    greenInput.value = cached.green;
    blueInput.value = cached.blue;
    saturationInput.value = cached.saturation;

    await setRGB(cached.red, cached.green, cached.blue);
    await setSaturation(cached.saturation);

    // Save & Apply on change
    async function handleRGBChange() {
        const red = parseInt(redInput.value);
        const green = parseInt(greenInput.value);
        const blue = parseInt(blueInput.value);
        const saturation = parseInt(saturationInput.value);

        await setRGB(red, green, blue);
        saveDisplaySettings(red, green, blue, saturation);
    }

    async function handleSaturationChange() {
        const saturation = parseInt(saturationInput.value);
        const red = parseInt(redInput.value);
        const green = parseInt(greenInput.value);
        const blue = parseInt(blueInput.value);

        await setSaturation(saturation);
        saveDisplaySettings(red, green, blue, saturation);
    }

    redInput.addEventListener("input", handleRGBChange);
    greenInput.addEventListener("input", handleRGBChange);
    blueInput.addEventListener("input", handleRGBChange);
    saturationInput.addEventListener("input", handleSaturationChange);
    resetButton.addEventListener("click", resetDisplaySettings);

    // Extra system info checks (unchanged)
    await Promise.all([
        checkModuleVersion(),
        checkServiceStatus(),
        checkCPUInfo(),
        checkProfile(),
        checkKernelVersion(),
        getAndroidVersion(),
        checkdndStatus(),
        checkDThermal(),
        checkEncoreVer(),
        checkfpsged(),
        checkiosched(),
        checkFSTrim(),
        checkenctoast(),
        checkBypassChargeStatus(),
        checkSFL(),
        checkKillLog(),
        checkGPreload(),
        checkRamBoost(),
    ]);

    // Toggles (unchanged)
    document.getElementById("disablevsync").addEventListener("click", applydisablevsync);
    document.getElementById("GPreload").addEventListener("change", function () {
        setGPreloadStatus(this.checked);
    });
    document.getElementById("clearbg").addEventListener("change", function () {
        setRamBoostStatus(this.checked);
    });
    document.getElementById("SFL").addEventListener("change", function () {
        setSFL(this.checked);
    });
    document.getElementById("DThermal").addEventListener("change", function () {
        setDThermal(this.checked);
    });
    document.getElementById("dnd").addEventListener("change", function () {
        setdndStatus(this.checked);
    });
    document.getElementById("encoretoast").addEventListener("change", function () {
        setenctoast(this.checked);
    });
    document.getElementById("iosched").addEventListener("change", function () {
        setiosched(this.checked);
    });
    document.getElementById("FSTrim").addEventListener("change", function () {
        setFSTrim(this.checked);
    });
    document.getElementById("logd").addEventListener("change", function () {
        setKillLog(this.checked);
    });
    document.getElementById("fpsged").addEventListener("change", function () {
        setfpsged(this.checked);
    });
    document.getElementById("Zepass").addEventListener("change", function () {
        setBypassChargeStatus(this.checked);
    });
});
