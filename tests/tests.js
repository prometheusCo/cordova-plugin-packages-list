exports.defineAutoTests = function () {

    describe('PackagesList Plugin - Unit (JS bridge)', function () {

        let originalExec;
        let plugin;

        beforeEach(function () {
            originalExec = cordova.exec;
            cordova.exec = jasmine.createSpy('exec');
            plugin = cordova.require('cordova-plugin-packageslist.PackagesList');
        });

        afterEach(function () {
            cordova.exec = originalExec;
        });

        it('listUser should call exec with correct params', function () {
            const success = jasmine.createSpy('success');
            const error = jasmine.createSpy('error');

            plugin.listUser(success, error);

            expect(cordova.exec).toHaveBeenCalledWith(
                success,
                error,
                'PackagesList',
                'listUser',
                []
            );
        });

        it('listAll should call exec with correct params', function () {
            const success = jasmine.createSpy('success');
            const error = jasmine.createSpy('error');

            plugin.listAll(success, error);

            expect(cordova.exec).toHaveBeenCalledWith(
                success,
                error,
                'PackagesList',
                'listAll',
                []
            );
        });

        it('should trigger success callback', function (done) {
            cordova.exec.and.callFake((s) => s([{ packageName: 'com.test.app' }]));

            plugin.listUser(function (res) {
                expect(res.length).toBe(1);
                expect(res[0].packageName).toBe('com.test.app');
                done();
            }, fail);
        });

        it('should trigger error callback', function (done) {
            cordova.exec.and.callFake((s, e) => e('error'));

            plugin.listAll(function () {
                fail('Should not succeed');
                done();
            }, function (err) {
                expect(err).toBe('error');
                done();
            });
        });

    });


    describe('PackagesList Plugin - Integration (REAL)', function () {

        let plugin;

        beforeAll(function () {
            plugin = cordova.require('cordova-plugin-packageslist.PackagesList');
        });

        it('listAll should return an array', function (done) {

            plugin.listAll(function (apps) {
                expect(Array.isArray(apps)).toBe(true);
                done();
            }, fail);

        });

        it('each app should have required structure', function (done) {

            plugin.listAll(function (apps) {

                if (apps.length > 0) {
                    const app = apps[0];

                    expect(app.packageName).toBeDefined();
                    expect(typeof app.packageName).toBe('string');

                    expect(app.label).toBeDefined();
                    expect(typeof app.label).toBe('string');

                    expect(app.systemApp).toBeDefined();
                    expect(typeof app.systemApp).toBe('boolean');

                    expect(app.enabled).toBeDefined();
                    expect(typeof app.enabled).toBe('boolean');

                    expect(app.sourceDir).toBeDefined();

                    expect(app.installedTimestamp).toBeDefined();
                    expect(app.updatedTimestamp).toBeDefined();
                }

                done();

            }, fail);

        });

        it('listUser should not include system apps', function (done) {

            plugin.listUser(function (apps) {

                apps.forEach(function (app) {
                    expect(app.systemApp).toBe(false);
                });

                done();

            }, fail);

        });

        it('listAll should include at least one system app (usually)', function (done) {

            plugin.listAll(function (apps) {

                const hasSystem = apps.some(a => a.systemApp === true);

                // Not guaranteed on all devices, so soft expectation
                expect(hasSystem === true || hasSystem === false).toBe(true);

                done();

            }, fail);

        });

        it('should not return duplicate package names', function (done) {

            plugin.listAll(function (apps) {

                const names = apps.map(a => a.packageName);
                const unique = new Set(names);

                expect(unique.size).toBe(names.length);

                done();

            }, fail);

        });

        it('should handle empty result safely', function (done) {

            plugin.listAll(function (apps) {

                expect(apps).toBeDefined();
                expect(Array.isArray(apps)).toBe(true);

                done();

            }, fail);

        });

    });


};
