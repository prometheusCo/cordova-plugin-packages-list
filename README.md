# cordova-plugin-packages-list

Plugin de Cordova que permite obtener la lista de paquetes instalados en Android, incluyendo su nombre de paquete, ruta del APK y metadatos básicos.

## Instalación

```bash
cordova plugin add https://github.com/prometheusCo/cordova-plugin-packages-list/releases/download/v.1.0.2/cordova-plugin-packages-list-1.0.2.tgz
```

---

## Uso

```javascript
document.addEventListener('deviceready', function () {
    cordova.plugins.packagesList.listAll(
        function (res) {
            console.log("RESULT:", res);
        },
        function (err) {
            console.error("ERROR:", err);
        }
    );
});
```

---

## Métodos

### listAll(success, error)

Devuelve todas las aplicaciones visibles (incluyendo las del sistema).

### listUser(success, error)

Devuelve únicamente las aplicaciones visibles instaladas por el usuario.

---

## Formato de respuesta

```json
[
  {
    "label": "App Name",
    "packageName": "com.example.app",
    "sourceDir": "/data/app/...",
    "systemApp": false,
    "enabled": true,
    "installedTimestamp": 1670000000000,
    "updatedTimestamp": 1675000000000
  }
]
```

---

## Permisos en Android

### Android 11+ (API 30 o superior)

Android introduce restricciones de visibilidad de paquetes.

### Modo completo (con permiso)

Para obtener la lista completa de aplicaciones instaladas, la aplicación debe declarar:

```xml
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />
```

---

### Modo limitado (sin permiso)

Si no se declara el permiso, el plugin utiliza un fallback basado en apps con launcher.

Para que este modo funcione correctamente, el plugin declara automáticamente:

```xml
<queries>
    <intent>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent>
</queries>
```

Este modo:

- Devuelve aplicaciones con icono en el launcher  
- No devuelve todas las apps instaladas  
- Está limitado por las reglas de visibilidad de Android  

---

## Advertencia (Política de Google Play)

El permiso `QUERY_ALL_PACKAGES` está considerado sensible por Google Play.

Su uso debe estar justificado durante la publicación. Este plugin solo debería utilizarse si la aplicación encaja en alguna de las categorías permitidas, como:

- Aplicaciones de seguridad o antivirus  
- Gestión de dispositivos  
- Control parental  
- Herramientas de gestión de archivos o búsqueda con necesidad de visibilidad amplia  

---

## Licencia

MIT

#
#
#
#

# cordova-plugin-packages-list

A Cordova plugin that retrieves the list of installed Android applications, including metadata such as package name, APK path, and basic information.

---

## Installation

```bash
cordova plugin add https://github.com/prometheusCo/cordova-plugin-packages-list/releases/download/v.1.0.2/cordova-plugin-packages-list-1.0.2.tgz
```

---

## Usage

```javascript
document.addEventListener('deviceready', function () {
    cordova.plugins.packagesList.listAll(
        function (res) {
            console.log("RESULT:", res);
        },
        function (err) {
            console.error("ERROR:", err);
        }
    );
});
```

---

## Methods

### listAll(success, error)

Returns all visible applications (including system apps).

### listUser(success, error)

Returns only visible user-installed applications.

---

## Response Format

```json
[
  {
    "label": "App Name",
    "packageName": "com.example.app",
    "sourceDir": "/data/app/...",
    "systemApp": false,
    "enabled": true,
    "installedTimestamp": 1670000000000,
    "updatedTimestamp": 1675000000000
  }
]
```

---

## Android Permissions

### Android 11+ (API 30 and above)

Android introduces package visibility restrictions.

### Full mode (with permission)

To retrieve the full list of installed applications, your app must declare:

```xml
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />
```

---

### Limited mode (no permission)

If the permission is not declared, the plugin uses a launcher-based fallback.

To make this mode work properly, the plugin automatically declares:

```xml
<queries>
    <intent>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent>
</queries>
```

This mode:

- Returns apps with launcher icons  
- Does NOT return all installed apps  
- Is limited by Android visibility rules  

---

## Important Warning (Google Play Policy)

The `QUERY_ALL_PACKAGES` permission is considered sensitive by Google Play.

You must justify its usage during app submission. This plugin should only be used if your app falls under one of the accepted categories, such as:

- Antivirus or security apps  
- Device management apps  
- Parental control apps  
- File managers or search tools requiring broad visibility  

---

## License

MIT
