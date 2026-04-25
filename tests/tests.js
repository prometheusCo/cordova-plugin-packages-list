exports.defineAutoTests = function () {

    describe('PackagesList Plugin', function () {

        var originalExec;
        var plugin;

        beforeEach(function () {

            originalExec = cordova.exec;
            cordova.exec = jasmine.createSpy('exec');
            plugin = cordova.require('cordova-plugin-packageslist.PackagesList');
        });

        afterEach(function () {
            cordova.exec = originalExec;
        });

        it('should call exec with correct params for listUser', function () {

            var success = jasmine.createSpy('success');
            var error = jasmine.createSpy('error');

            plugin.listUser(success, error);

            expect(cordova.exec).toHaveBeenCalledWith(
                success,
                error,
                'PackagesList',
                'listUser',
                []
            );
        });

        it('should call exec with correct params for listAll', function () {

            var success = jasmine.createSpy('success');
            var error = jasmine.createSpy('error');

            plugin.listAll(success, error);

            expect(cordova.exec).toHaveBeenCalledWith(
                success,
                error,
                'PackagesList',
                'listAll',
                []
            );
        });

        it('should trigger success callback when exec succeeds (listUser)', function (done) {

            cordova.exec.and.callFake(function (s, e) {
                s([{ packageName: 'com.test.app' }]);
            });

            plugin.listUser(function (res) {
                expect(res).toEqual([{ packageName: 'com.test.app' }]);
                done();
            }, function () {
                fail('Error callback should not be called');
                done();
            });
        });

        it('should trigger error callback when exec fails (listAll)', function (done) {

            cordova.exec.and.callFake(function (s, e) {
                e('Some error');
            });

            plugin.listAll(function () {
                fail('Success callback should not be called');
                done();
            }, function (err) {
                expect(err).toBe('Some error');
                done();
            });
        });

    });

};