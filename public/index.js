'use strict'

function throttle(callback, limit) {
    let waiting = false

    return function (...args) {
        if (!waiting) {
            callback.apply(this, args)
            waiting = true

            setTimeout(() => {
                waiting = false
            }, limit)
        }
    }
}

window.onload = function () {
    const mainForm = document.getElementById('main-form')
    const mainSubmitButton = document.getElementById('main-submit')

    mainForm.addEventListener(
        'submit',
        throttle((event) => {
            mainSubmitButton.setAttribute('disabled', 'disabled')
        }, 10000)
    )
}
