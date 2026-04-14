# cordova-plugin-packages-list

A Cordova plugin that retrieves the list of installed Android applications (packages), including their package name and source directory.

---

## Features

* List all installed applications (including system apps)
* List only user-installed applications
* Returns structured JSON data
* Works asynchronously (non-blocking)

---

## Installation

### Local install (recommended for development)

```bash
cordova plugin add file:/absolute/path/to/cordova-plugin-packages-list
```

### From packaged `.tgz`

```bash
cordova plugin add file:/absolute/path/to/cordova-plugin-packages-list-1.0.0.tgz
```

---

## Usage

Wait for `deviceready` before calling the plugin:

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

## Requirements

* Android platform only
* Cordova Android 10+
* Device or emulator (does not work in browser)

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

### What to explain to Google Play reviewers

When submitting your app, clearly state:

* Why your app requires access to the full list of installed applications
* How this data is used in core functionality
* That the permission is essential and cannot be replaced with a narrower alternative

Example justification:

> This application requires access to the list of installed applications in order to perform core functionality such as security analysis, application management, or user-requested inspection of installed software. The use of `QUERY_ALL_PACKAGES` is strictly limited to these purposes and is necessary for the app to function as intended.

Failure to properly justify this permission may result in app rejection or removal from Google Play.

---

## Notes

* On Android 11+, without this permission, the plugin will return a limited or empty list
* Behavior may vary depending on device manufacturer and OS restrictions
* Always test on a real device

---

## License

MIT

