exports.defineAutoTests = function () {

    describe('PackagesList Plugin', function () {

        var plugin;
        var originalExec;

        beforeEach(function () {
            plugin = cordova.require('cordova-plugin-packageslist.PackagesList');
        });

        afterEach(function () {
            if (originalExec) {
                cordova.exec = originalExec;
                originalExec = null;
            }
        });

        // -------------------------------------------------
        // 1) BRIDGE TEST (MOCK) → success / error propagation
        // -------------------------------------------------
        describe('Bridge (mocked exec)', function () {

            beforeEach(function () {
                originalExec = cordova.exec;
                cordova.exec = jasmine.createSpy('exec');
            });

            it('should propagate success callback', function (done) {

                cordova.exec.and.callFake(function (s, e) {
                    s([{ packageName: 'mock.app' }]);
                });

                plugin.listUser(function (res) {
                    expect(res).toEqual([{ packageName: 'mock.app' }]);
                    done();
                }, function () {
                    fail('Error callback should not be called');
                    done();
                });
            });

            it('should propagate error callback', function (done) {

                cordova.exec.and.callFake(function (s, e) {
                    e('mock error');
                });

                plugin.listAll(function () {
                    fail('Success callback should not be called');
                    done();
                }, function (err) {
                    expect(err).toBe('mock error');
                    done();
                });
            });

        });

        // -------------------------------------------------
        // 2) REAL TESTS → Android + Java execution ENV
        // -------------------------------------------------
        describe('Real plugin behavior (Android)', function () {

            it('listAll should return valid structured apps (all items)', function (done) {

                plugin.listAll(function (res) {

                    expect(Array.isArray(res)).toBe(true);

                    if (res.length > 0) {

                        var validateApp = function (app) {

                            // --- existence ---
                            expect(app).toBeDefined();

                            // --- label ---
                            expect(app.label).toBeDefined();
                            expect(typeof app.label).toBe('string');
                            expect(app.label.length).toBeGreaterThan(0);

                            // --- packageName ---
                            expect(app.packageName).toBeDefined();
                            expect(typeof app.packageName).toBe('string');
                            expect(app.packageName.length).toBeGreaterThan(0);

                            // --- sourceDir ---
                            expect(app.sourceDir).toBeDefined();
                            expect(typeof app.sourceDir).toBe('string');

                            // --- systemApp ---
                            expect(app.systemApp).toBeDefined();
                            expect(typeof app.systemApp).toBe('boolean');

                            // --- enabled ---
                            expect(app.enabled).toBeDefined();
                            expect(typeof app.enabled).toBe('boolean');

                            // --- installedTimestamp ---
                            expect(app.installedTimestamp).toBeDefined();
                            expect(typeof app.installedTimestamp).toBe('number');
                            expect(isNaN(app.installedTimestamp)).toBe(false);
                            expect(app.installedTimestamp).toBeGreaterThan(0);

                            // --- updatedTimestamp ---
                            expect(app.updatedTimestamp).toBeDefined();
                            expect(typeof app.updatedTimestamp).toBe('number');
                            expect(isNaN(app.updatedTimestamp)).toBe(false);
                            expect(app.updatedTimestamp).toBeGreaterThan(0);

                            // --- logical consistency ---
                            expect(app.updatedTimestamp).toBeGreaterThanOrEqual(app.installedTimestamp);

                        };

                        res.forEach(validateApp);
                    }

                    done();

                }, function (err) {
                    fail('Error: ' + err);
                    done();
                });

            });

            it('listUser should return only non-system apps', function (done) {

                plugin.listUser(function (res) {

                    expect(Array.isArray(res)).toBe(true);

                    res.forEach(function (app) {
                        expect(app.systemApp).toBe(false);
                    });

                    done();

                }, function (err) {
                    fail('Error: ' + err);
                    done();
                });

            });


            it('listUser vs listAll should enforce correct filtering logic', function (done) {

                plugin.listAll(function (allApps) {

                    plugin.listUser(function (userApps) {

                        expect(Array.isArray(allApps)).toBe(true);
                        expect(Array.isArray(userApps)).toBe(true);

                        // --- Build sets for comparison ---
                        var allMap = new Map();
                        allApps.forEach(function (app) {
                            allMap.set(app.packageName, app);
                        });

                        // --- 1) listUser must contain ONLY non-system apps ---
                        userApps.forEach(function (app) {
                            expect(app.systemApp).toBe(false);
                        });

                        // --- 2) listAll must contain at least one system app ---
                        var systemApps = allApps.filter(function (app) {
                            return app.systemApp === true;
                        });

                        expect(systemApps.length).toBeGreaterThan(0);

                        // --- 3) Every user app must exist in listAll ---
                        userApps.forEach(function (app) {
                            expect(allMap.has(app.packageName)).toBe(true);
                        });

                        // --- 4) listAll must equal (userApps + systemApps) ---
                        var userSet = new Set(userApps.map(function (a) {
                            return a.packageName;
                        }));

                        var systemSet = new Set(systemApps.map(function (a) {
                            return a.packageName;
                        }));

                        // No overlap between user and system apps
                        userSet.forEach(function (pkg) {
                            expect(systemSet.has(pkg)).toBe(false);
                        });

                        // Combined sets must match allApps
                        var combinedSet = new Set([...userSet, ...systemSet]);

                        expect(combinedSet.size).toBe(allApps.length);

                        done();

                    }, function (err) {
                        fail('Error (listUser): ' + err);
                        done();
                    });

                }, function (err) {
                    fail('Error (listAll): ' + err);
                    done();
                });

            });
            // listAll method check end

        });

    });

};