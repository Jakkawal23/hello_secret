(async function() {
  const $ = id => document.getElementById(id);

  const input = $("input");
  const output = $("output");
  const mode = $("mode");

  const transformBtn = $("transformBtn");
  const clearBtn = $("clearBtn");
  const copyBtn = $("copyBtn");

  let mapping = {};
  try {
    const res = await fetch("mapping.json");
    mapping = await res.json();
  } catch (err) {
    console.error("ไม่พบ mapping.json หรือโหลดไม่สำเร็จ", err);
  }

  // เติม th2en จาก en2th
  if (mapping.en2th && !mapping.th2en) {
    mapping.th2en = Object.fromEntries(
      Object.entries(mapping.en2th).map(([k, v]) => [v, k])
    );
  }

  // ตรวจภาษา
  const detectLang = text => /[ก-๙]/.test(text) ? "th" : "en";

  // แปลงข้อความ
  const translate = (text, mode) => {
    if (!text) return "";

    let direction = mode;

    if (mode === "auto") {
        direction = /[ก-๙]/.test(text) ? "th2en" : "en2th";
    }

    const map = mapping[direction] || {};
    return [...text].map(ch => map[ch] || ch).join('');
  };

  const doTransform = () => {
    output.value = translate(input.value, mode.value);
  };

  transformBtn.addEventListener("click", doTransform);
  input.addEventListener("input", doTransform);
  clearBtn.addEventListener("click", () => { input.value=''; output.value=''; input.focus(); });
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(output.value);
      alert('คัดลอกแล้ว!');
    } catch {
      alert('ไม่สามารถคัดลอกได้');
    }
  });
})();
