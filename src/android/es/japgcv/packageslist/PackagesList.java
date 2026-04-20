package es.japgcv.packageslist;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageInfo;

import java.util.Set;
import java.util.HashSet;
import android.content.Intent;
import android.content.pm.ResolveInfo;

import java.util.List;

public class PackagesList extends CordovaPlugin {

    //
    // Helper - checks if QUERY_ALL_PACKAGES exists in manifest
    public static boolean hasPermissionAlt(Context context) {

        if (context == null)
            return false;

        try {

            PackageManager pm = context.getPackageManager();
            PackageInfo info;

            if (android.os.Build.VERSION.SDK_INT >= 33) {

                info = pm.getPackageInfo(
                        context.getPackageName(),
                        PackageManager.PackageInfoFlags.of(PackageManager.GET_PERMISSIONS));
            } else {

                info = pm.getPackageInfo(
                        context.getPackageName(),
                        PackageManager.GET_PERMISSIONS);
            }

            if (info.requestedPermissions == null)
                return false;

            for (String p : info.requestedPermissions) {
                if ("android.permission.QUERY_ALL_PACKAGES".equals(p)) {
                    return true;
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    //
    // Helper that comunicates to main loop when to skip a duplicated/ bad pos
    public static boolean skipPosition(Set<String> seen, boolean noPermissions, ApplicationInfo app) {

        if (app == null || app.packageName == null)
            return true;

        if ((noPermissions && seen.contains(app.packageName)))
            return true;

        return false;
    }

    //
    // Main code
    //
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {

        final boolean onlyUser = "listUser".equals(action);
        final boolean listAll = "listAll".equals(action);
        final Context context = cordova.getContext();
        final boolean noPermissions = !hasPermissionAlt(context);

        cordova.getThreadPool().execute(new Runnable() {

            @Override
            public void run() {

                try {

                    JSONArray result = new JSONArray(); // Return list for each package
                    Set<String> seen = new HashSet<>(); // Used for arking seen packages

                    PackageManager pm = context.getPackageManager();

                    // List of packages/apps
                    List<ApplicationInfo> pckgs = pm.getInstalledApplications(0);
                    // with a declared activity as fallback
                    List<ResolveInfo> apps = null;

                    if (noPermissions) {

                        Intent intent = new Intent(Intent.ACTION_MAIN, null);
                        intent.addCategory(Intent.CATEGORY_LAUNCHER);

                        // If no QUERY_ALL_PACKAGES permission we use packages
                        // with a declared activity as fallback
                        apps = pm.queryIntentActivities(intent, 0);

                    }

                    int size = noPermissions ? (apps != null ? apps.size() : 0) : pckgs.size();

                    // Main packages/ apps listing loop
                    for (int i = 0; i < size; i++) {

                        ApplicationInfo app;

                        if (noPermissions) {

                            ResolveInfo r = apps.get(i);
                            try {
                                app = pm.getApplicationInfo(r.activityInfo.packageName, 0);
                            } catch (Exception e) {
                                
                                app = null;
                                e.printStackTrace();
                            }

                        } else {
                            app = pckgs.get(i);
                        }

                        // Some data integrity checks to prevent returning empty/corrupted entries
                        if (skipPosition(seen, noPermissions, app))
                            continue;

                        String packageName = app.packageName;

                        boolean isSystem = (app.flags &
                                (ApplicationInfo.FLAG_SYSTEM | ApplicationInfo.FLAG_UPDATED_SYSTEM_APP)) != 0;

                        if (listAll || (onlyUser && !isSystem)) {

                            JSONObject obj = new JSONObject();
                            PackageInfo pi = null;
                            long firstInstallTime = 0;
                            long lastUpdateTime = 0;

                            CharSequence label = pm.getApplicationLabel(app);
                            obj.put("label", label != null ? label.toString() : "");

                            obj.put("packageName", app.packageName);
                            obj.put("sourceDir", app.sourceDir);
                            obj.put("systemApp", isSystem);
                            obj.put("enabled", app.enabled);

                            try {

                                pi = pm.getPackageInfo(packageName, 0);
                                firstInstallTime = pi.firstInstallTime;
                                lastUpdateTime = pi.lastUpdateTime;

                                obj.put("installedTimestamp", firstInstallTime);
                                obj.put("updatedTimestamp", lastUpdateTime);

                            } catch (Exception e) {
                                e.printStackTrace();
                            }

                            result.put(obj);

                            if (noPermissions)
                                seen.add(packageName);

                        }
                    }

                    callbackContext.success(result);

                } catch (Exception e) {
                    callbackContext.error(e != null ? e.toString() : "Unknown error");
                }
            }

        });

        return true;
    }

}