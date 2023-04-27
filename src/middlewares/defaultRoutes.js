function isDefaultRoute(url) {
    if (!url.startsWith('/admin')
        && !url.startsWith('/i18n/locales')
        && !url.startsWith('/content')
        && !url.startsWith('/upload')
        && !url.startsWith('/expo-notifications')
        && !url.startsWith('/plugins')
        && !url.startsWith('/users-permissions')
        && !url.startsWith('/auth/google')
        && !url.startsWith('/auth/facebook')
        && !url.startsWith('/auth/github')
        && !url.startsWith('/email')
        && url != '/'
        && url != '' ){
        return false
    } else{
        return true
    }
}

module.exports = { isDefaultRoute };
