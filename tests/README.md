# Tests (Cordova Test Framework)

### Descripción
Este plugin incluye tests automáticos que se ejecutan dentro de un entorno real de Cordova usando  
cordova-plugin-test-framework  

### Requisitos
- Cordova CLI  
- Plataforma Android  

### Instalación y ejecución
1. Crear app de pruebas:
   "cordova create testApp"
   
2. Añadir plataforma:
   cordova platform add android

3. Instalar framework de tests:
   "cordova plugin add cordova-plugin-test-framework"

4. Instalar este plugin:
   "cordova plugin add ../cordova-plugin-packageslist"

5. Ejecutar:
   cordova run android

### Ejecutar tests

- Abrir la app en dispositivo/emulador  
- Entrar en "Auto Tests"  

---

### Notas sobre el diseño de los tests

- Estos tests están diseñados exclusivamente para ejecutarse en un entorno real de Android (Cordova + Android SDK).  
- No son portables ni están pensados para ejecutarse en navegador o CI genérico.  
- Se validan dos niveles:
  - JS bridge (mocked): propagación de callbacks (`success` / `error`)
  - Ejecución real (Android): comportamiento real del plugin  

- Se asume un entorno Android estándar donde existen apps de sistema.  
- Los tests validan:
  - Estructura y tipos de datos devueltos  
  - Consistencia de timestamps  
  - Lógica de filtrado (`listUser` vs `listAll`) mediante invariantes (subconjunto, no solapamiento, unión total)

- No se validan aspectos internos de Android (PackageManager, permisos, OEM differences), ya que están fuera del alcance del layer JavaScript.

---

---
---

### Overview

This plugin includes automated tests that run inside a real Cordova environment using  
cordova-plugin-test-framework  

### Requirements
- Cordova CLI installed  
- Android platform (or compatible)

### Setup & Run
1. Create test app:
   "cordova create testApp"
   
2. Add platform:
   "cordova platform add android"

3. Install test framework:
   cordova plugin add cordova-plugin-test-framework

4. Install this plugin:
   cordova plugin add ../cordova-plugin-packageslist

5. Run:
   cordova run android

### Run tests
- Open app on device/emulator  
- Go to "Auto Tests"  

---

### Test Design Notes

- These tests are intentionally designed to run only in a real Android environment (Cordova + Android SDK).  
- They are not portable and are not intended for generic web or CI environments.  

- Two levels are validated:
  - JS bridge (mocked): verifies correct success/error callback propagation  
  - Real execution (Android): validates actual plugin behavior  

- The environment assumes standard Android behavior where system apps are present.  
- Tests focus on:
  - Data contract validation (types, structure, timestamps)  
  - Behavioral correctness (`listUser` vs `listAll`) using set invariants (subset, no overlap, union = total)

- Android internal correctness (PackageManager, permissions, OEM differences) is intentionally out of scope for these tests.

