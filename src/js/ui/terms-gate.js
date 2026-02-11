"use strict";

(function enforceTermsGate() {
  let ok = false;
  try {
    ok =
      (typeof window !== "undefined" &&
        window.SecureStorage &&
        window.SecureStorage.getItem("termos_aceitos") === true) ||
      (typeof localStorage !== "undefined" &&
        localStorage.getItem("ineleg_termos_aceitos") === "true");
  } catch (e) {
    ok = false;
  }
  if (!ok) {
    window.location.href = "index.html#termos";
  }
})();

