function isDefaultRoute(url) {
    if (!url.startsWith('/admin')
        && !url.startsWith('/i18n')
        && !url.startsWith('/content')
        && !url.startsWith('/upload')
        && !url.startsWith('/expo-notifications')
        && !url.startsWith('/plugins')
        && !url.startsWith('/pagamento')
        && !url.startsWith('/users-permissions')
        && !url.startsWith('/auth/google')
        && !url.startsWith('/auth/facebook')
        && !url.startsWith('/auth/github')
        && !url.startsWith('/email')
        && !url.startsWith('/_health')        
        && url != '/'
        && url != '' ){
        return false
    } else{
        return true
    }
}

module.exports = { isDefaultRoute };
