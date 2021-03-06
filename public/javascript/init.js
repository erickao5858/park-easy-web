let userCoordinates
let currentUser
let userSettings
const DEV_MODE = false
const API_URL = {
    'PRO': 'https://park-easy-api.mybluemix.net/',
    'DEV': 'http://localhost:3001/'
}
const url = DEV_MODE ? API_URL['DEV'] : API_URL['PRO']
const DATA_URL = 'https://1b662c15.us-south.apigw.appdomain.cloud/park-easy-data/location'

if (location.protocol != 'https:') {
    location.protocol = 'https:'
}

$(document).ready(() => {
    appendSideNav()

    // Initialize materializecss components
    M.AutoInit()

    detectBrowserType()

    // Retrieve current user from local storage
    currentUser = Utility.getItemFromLocalStorage('currentUser')
    if (currentUser) appendUserInfo()
    userSettings = Utility.getItemFromLocalStorage('settingValues')

    $('#btnMenu').click(() => {
        // Let the button triggers side navigator
        $('.sidenav').sidenav('open')
    })
})

const detectBrowserType = () => {
    const browserCheck = Utility.getItemFromLocalStorage('browserCheck')
    if (browserCheck) return
    var ua = navigator.userAgent
    console.log(ua)
    ua = ua.toLowerCase()

    //Check User Agent string for 'mobi' and if not route to Desktop page
    if (!ua.includes('mobi')) {
        alert('This website is incompitable with desktop environment, some functions might not work properly.')
        Utility.setItemToLocalStorage('browserCheck', true)
    }
}

const appendUserInfo = () => {
    const userInfoElement = $('#slide-out').children().first()
    userInfoElement.click(() => {
        // Logout user
        Utility.removeItemFromLocalStorage('currentUser')
        $(location).attr('href', url + 'logout')
    })
    userInfoElement.html('<a class="waves-effect" href="#"><i class="material-icons">person</i>Sign out</a>')
}

$(document).ajaxError((event, jqxhr, settings, thrownError) => {
    M.toast({ html: 'Service unavailable, please check your network status!', completeCallback: () => { if (confirm('Please Refresh the page')) { location.reload() } } })
})

const appendSideNav = () => {
    $('body').prepend('<nav> <div class="nav-wrapper"><a href="#" class="brand-logo">Park Easy</a></div></nav>')
    $('nav').after('<ul id="slide-out" class="sidenav"></ul>')
    $('.sidenav').append('<li><a class="waves-effect" href="/login"><i class="material-icons">person</i>Sign in</a></li>')
    $('.sidenav').append('<li><div class="divider"></div></li>')
    $('.sidenav').append('<li><a class="waves-effect" href="/">Locations</a></li>')
    $('.sidenav').append('<li><a class="waves-effect" href="/settings">Settings</a></li>')
    $('.sidenav').append('<li><div class="divider"></div></li>')
    $('.sidenav').append('<li><a class="waves-effect" href="/feedback">Feedback</a></li>')
    $('.sidenav').append('<li><a class="waves-effect" href="https://park-easy-landing.mybluemix.net/" target="_blank">About us</a></li>')
    $('.sidenav').append('<li><a class="subheader">v1.2.0</a></li>')
    $('.sidenav').after('<div id="btnMenu"></div>')
    $('#btnMenu').append('<a class="btn-floating btn-large waves-effect waves-light blue"><i class="fas fa-bars"></i></a>')
}