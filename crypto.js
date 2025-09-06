(function () {
  const $ = id => document.getElementById(id);

  const inputText = $("inputText");
  const outputText = $("outputText");
  const algorithm = $("algorithm");
  const key = $("key");
  const keyContainer = $("key-container");

  const encodeBtn = $("encodeBtn");
  const decodeBtn = $("decodeBtn");
  const copyBtn = $("copyBtn");
  const clearBtn = $("clearBtn");

  // แสดง/ซ่อน Key ตาม Algorithm
  const updateKeyVisibility = () => {
    const algo = algorithm.value;
    if (algo === "caesar" || algo === "xor") {
      keyContainer.classList.remove("hidden");
    } else {
      keyContainer.classList.add("hidden");
      key.value = "";
    }
  };
  algorithm.addEventListener("change", updateKeyVisibility);
  updateKeyVisibility();

  // Caesar Cipher
  const caesarShift = (text, shift, decode = false) => {
    if (isNaN(shift)) return text;
    if (decode) shift = -shift;
    return text.replace(/[ -~]/g, c => {
      const code = c.charCodeAt(0);
      return String.fromCharCode(((code - 32 + shift + 95) % 95) + 32);
    });
  };

  // XOR Cipher
  const xorCipher = (text, keyStr) => {
    if (!keyStr) return text;
    return Array.from(text).map((ch, i) =>
      String.fromCharCode(ch.charCodeAt(0) ^ keyStr.charCodeAt(i % keyStr.length))
    ).join("");
  };

  const encode = (text, algo, keyVal) => {
    switch (algo) {
      case "base64": return btoa(unescape(encodeURIComponent(text)));
      case "rot13": return text.replace(/[a-zA-Z]/g, c =>
        String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() < "n" ? 13 : -13))
      );
      case "reverse": return text.split("").reverse().join("");
      case "caesar": return caesarShift(text, parseInt(keyVal || "0"), false);
      case "xor": return btoa(xorCipher(text, keyVal || "key"));
      default: return text;
    }
  };

  const decode = (text, algo, keyVal) => {
    switch (algo) {
      case "base64": return decodeURIComponent(escape(atob(text)));
      case "rot13": return encode(text, "rot13");
      case "reverse": return text.split("").reverse().join("");
      case "caesar": return caesarShift(text, parseInt(keyVal || "0"), true);
      case "xor": return xorCipher(atob(text), keyVal || "key");
      default: return text;
    }
  };

  // ปุ่มเข้ารหัส
  encodeBtn.addEventListener("click", () => {
    outputText.value = encode(inputText.value, algorithm.value, key.value);
  });

  // ปุ่มถอดรหัส
  decodeBtn.addEventListener("click", () => {
    outputText.value = decode(inputText.value, algorithm.value, key.value);
  });

  // ปุ่มคัดลอกผลลัพธ์
  copyBtn.addEventListener("click", async () => {
    if (!outputText.value) return;
    try {
      await navigator.clipboard.writeText(outputText.value);
      alert("คัดลอกผลลัพธ์เรียบร้อยแล้ว!");
    } catch {
      alert("ไม่สามารถคัดลอกได้");
    }
  });

  // ปุ่มเคลียร์
  clearBtn.addEventListener("click", () => {
    inputText.value = "";
    outputText.value = "";
    key.value = "";
    inputText.focus();
  });
})();
