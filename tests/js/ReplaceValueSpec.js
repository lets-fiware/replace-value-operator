/*
 * replace-value-list
 * https://github.com/lets-fiware/replace-value-list-operator
 *
 * Copyright (c) 2019-2024 Kazuhito Suda
 * Licensed under the MIT license.
 */

/* globals MockMP */

(function () {

    "use strict";

    describe("ReplaceValueList", function () {

        beforeAll(function () {
            window.MashupPlatform = new MockMP({
                type: 'operator',
                prefs: {
                    "send_nulls": true,
                    "replace": "-9999,missing data"
                },
                inputs: ['input'],
                outputs: ['output']
            });
        });

        beforeEach(function () {
            MashupPlatform.reset();
            MashupPlatform.operator.outputs.output.connect({simulate: () => {}});
        });

        it("no replace (numeric)", function () {
            replaceValue(1);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', 1);
        });

        it("no replace (string)", function () {
            replaceValue("abc");

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', "abc");
        });

        it("replace (numeric)", function () {
            replaceValue(-9999);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', "missing data");
        });

        it("replace (string)", function () {
            MashupPlatform.prefs.set("replace", "abc,xyz");

            replaceValue("abc");

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', "xyz");
        });

        it("allowed to send nulls", function () {
            MashupPlatform.prefs.set("send_nulls", true);

            replaceValue(null);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', null);
        });

        it("disallowed to send nulls", function () {
            MashupPlatform.prefs.set("send_nulls", false);

            replaceValue(null);

            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        });

        it("replace parameter error", function () {
            MashupPlatform.prefs.set("replace", "123,abc,xyz");

            expect(function () {
                replaceValue(5);
            }).toThrowError(MashupPlatform.wiring.EndpointValueError);
        });


    });
})();
