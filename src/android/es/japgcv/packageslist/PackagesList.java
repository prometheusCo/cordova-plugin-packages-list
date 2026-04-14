package es.japgcv.packageslist;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONObject;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;

import java.util.List;

public class PackagesList extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {

        final boolean onlyUser = "listUser".equals(action);
        final boolean listAll = "listAll".equals(action);

        if (!onlyUser && !listAll) {
            callbackContext.error("Invalid action. Allowed: listAll, listUser");
            return false;
        }

        if (cordova.getActivity() == null) {
            callbackContext.error("Activity is null");
            return false;
        }

        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {

                    PackageManager pm = cordova.getActivity().getPackageManager();
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