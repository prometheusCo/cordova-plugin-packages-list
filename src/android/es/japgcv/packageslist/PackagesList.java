package es.japgcv.packageslist;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageInfo;

import java.util.List;

public class PackagesList extends CordovaPlugin {

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
    // Main code
    //
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {

        final boolean onlyUser = "listUser".equals(action);
        final boolean listAll = "listAll".equals(action);
        final Context context = cordova.getContext();
        final boolean noPermissions = !hasPermissionAlt(context);

        if (!onlyUser && !listAll) {
            callbackContext.error("Invalid action. Allowed: [listAll, listUser]!");
            return true;
        }

        if (noPermissions) {
            callbackContext.error("Missing QUERY_ALL_PACKAGES in manifest!");
            return true;
        }

        cordova.getThreadPool().execute(new Runnable() {

            @Override
            public void run() {

                try {

                    PackageManager pm = context.getPackageManager();
                    List<ApplicationInfo> apps = pm.getInstalledApplications(0);

                    JSONArray result = new JSONArray();

                    for (ApplicationInfo app : apps) {

                        if (app == null || app.packageName == null)
                            continue;

                        boolean isSystem = (app.flags &
                                (ApplicationInfo.FLAG_SYSTEM | ApplicationInfo.FLAG_UPDATED_SYSTEM_APP)) != 0;

                        if (listAll || (onlyUser && !isSystem)) {

                            JSONObject obj = new JSONObject();
                            obj.put("packageName", app.packageName);
                            obj.put("sourceDir", app.sourceDir);

                            result.put(obj);
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