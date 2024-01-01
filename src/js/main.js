/*
 * replace-value
 * https://github.com/lets-fiware/replace-value-operator
 *
 * Copyright (c) 2019-2024 Kazuhito Suda
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var getReplace = function getReplace() {
        var array = {};
        var values = MashupPlatform.prefs.get("replace").trim().split(',');
        if (values.length % 2 == 0) {
            for (var i = 0; i < values.length / 2; i++) {
                array[values[i]] = values[i + 1];
            }
        } else {
            throw new MashupPlatform.wiring.EndpointValueError();
        }
        return array;
    }

    var replaceValue = function replaceValue(value) {
        var replace = getReplace();
        if (value != null) {
            value = replace[value] || value;
            MashupPlatform.wiring.pushEvent("output", value);

        } else if (value == null && MashupPlatform.prefs.get("send_nulls")) {
            MashupPlatform.wiring.pushEvent("output", value);
        }
    }

    /* TODO
     * this if is required for testing, but we have to search a cleaner way
     */
    if (window.MashupPlatform != null) {
        MashupPlatform.wiring.registerCallback("input", replaceValue);
    }

    /* test-code */
    window.replaceValue = replaceValue;
    /* end-test-code */

})();
