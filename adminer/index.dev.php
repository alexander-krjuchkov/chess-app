<?php

function setAuthDefaults() {
    if (!empty($_GET)) {
        return;
    }

    $envNameToAuthKeyMap = [
        'ADMINER_DEFAULT_DRIVER' => 'driver',
        'ADMINER_DEFAULT_SERVER' => 'server',
        'ADMINER_DEFAULT_USERNAME' => 'username',
        'ADMINER_DEFAULT_PASSWORD' => 'password',
        'ADMINER_DEFAULT_DB' => 'db',
    ];

    foreach ($envNameToAuthKeyMap as $envVarName => $authField) {
        if (!empty($_ENV[$envVarName]) && empty($_POST['auth'][$authField])) {
            $_POST['auth'][$authField] = $_ENV[$envVarName];
        }
    }
}

setAuthDefaults();

include './adminer.php';
