# cordova-plugin-packages-list

Plugin de Cordova que permite obtener la lista de paquetes instalados en Android, incluyendo su nombre de paquete y la ruta del APK.


## Instalación

### Instalación local (recomendada para desarrollo)

    cordova plugin add file:/ruta/absoluta/a/cordova-plugin-packages-list-1.x.x.tgz

---

## Uso

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

---

## Métodos

### listAll(success, error)

Devuelve todos los paquetes instalados (incluyendo los del sistema).

### listUser(success, error)

Devuelve únicamente los paquetes instalados por el usuario.

---

## Formato de respuesta

    [
      {
        "packageName": "com.example.app",
        "sourceDir": "/data/app/..."
      }
    ]

---

## Permisos en Android

### Android 11+ (API 30 o superior)

Para obtener la lista completa de paquetes instalados, la aplicación debe declarar:

    <uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />

Este permiso es necesario debido a las restricciones de visibilidad de paquetes introducidas en Android 11.

---

## Advertencia (Política de Google Play)

El permiso `QUERY_ALL_PACKAGES` está considerado sensible por Google Play.

Su uso debe estar justificado durante la publicación. Este plugin solo debería utilizarse si la aplicación encaja en alguna de las categorías permitidas, como:

- Aplicaciones de seguridad o antivirus
- Gestión de dispositivos
- Control parental
- Herramientas de gestión de archivos o búsqueda con necesidad de visibilidad amplia


## Licencia

MIT


#
#
#
#

# cordova-plugin-packages-list

A Cordova plugin that retrieves the list of installed packages, including their package name and source directory.

---

## Features

* List all installed applications (including system apps)
* List only user-installed applications
* Returns structured JSON data
* Works asynchronously

---

## Installation

### Local install (recommended for development)


```bash
cordova plugin add file:/ruta/absoluta/a/cordova-plugin-packages-list-1.x.x.tgz
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

### Methods

#### `listAll(success, error)`

Returns all installed applications (including system apps).

#### `listUser(success, error)`

Returns only user-installed applications.

---

## Response Format

```json
[
  {
    "packageName": "com.example.app",
    "sourceDir": "/data/app/..."
  }
]
```

---

## Android Permissions

### Android 11+ (API 30 and above)

To retrieve the full list of installed applications, your app must declare:

```xml
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />
```

This permission is required due to package visibility restrictions introduced in Android 11.

---

## Important Warning (Google Play Policy)

The `QUERY_ALL_PACKAGES` permission is considered sensitive by Google Play.

You must justify its usage during app submission. This plugin should only be used if your app falls under one of the accepted categories, such as:

* Antivirus or security apps
* Device management apps
* Parental control apps
* File managers or search tools that require broad app visibility

## License

MIT

