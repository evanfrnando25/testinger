const wrappers = document.querySelectorAll('.card-slider')
const carousels = document.querySelectorAll('.carousel')
const arrowBtns = document.querySelectorAll('.card-slider .arrow')

carousels.forEach((carousel, index) => {
    const wrapper = wrappers[index]
    const firstCardWidth = carousel.querySelector('.card').offsetWidth
    const carouselChildrens = [...carousel.children]

    let isDragging = false,
        isAutoPlay = true,
        startX,
        startScrollLeft,
        timeoutId

    let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth)

    carouselChildrens
        .slice(-cardPerView)
        .reverse()
        .forEach((card) => {
            carousel.insertAdjacentHTML('afterbegin', card.outerHTML)
        })

    carouselChildrens.slice(0, cardPerView).forEach((card) => {
        carousel.insertAdjacentHTML('beforeend', card.outerHTML)
    })

    carousel.classList.add('no-transition')
    carousel.scrollLeft = carousel.offsetWidth
    carousel.classList.remove('no-transition')

    arrowBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            carousel.scrollLeft += btn.id == 'left' ? -firstCardWidth : firstCardWidth
        })
    })

    const dragStart = (e) => {
        isDragging = true
        carousel.classList.add('dragging')
        startX = e.pageX
        startScrollLeft = carousel.scrollLeft
    }

    const dragging = (e) => {
        if (!isDragging) return
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX)
    }

    const dragStop = () => {
        isDragging = false
        carousel.classList.remove('dragging')
    }

    const infiniteScroll = () => {
        if (carousel.scrollLeft === 0) {
            carousel.classList.add('no-transition')
            carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth
            carousel.classList.remove('no-transition')
        } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
            carousel.classList.add('no-transition')
            carousel.scrollLeft = carousel.offsetWidth
            carousel.classList.remove('no-transition')
        }

        clearTimeout(timeoutId)
        if (!wrapper.matches(':hover')) autoPlay()
    }

    const autoPlay = () => {
        if (window.innerWidth < 800 || !isAutoPlay) return
        timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500)
    }
    autoPlay()

    carousel.addEventListener('mousedown', dragStart)
    carousel.addEventListener('mousemove', dragging)
    document.addEventListener('mouseup', dragStop)
    carousel.addEventListener('scroll', infiniteScroll)
    wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId))
    wrapper.addEventListener('mouseleave', autoPlay)
})
document.getElementById('subscription-form').addEventListener('submit', function (event) {
    event.preventDefault()

    const emailInput = document.getElementById('email')
    const email = emailInput.value.trim()
    const gdprCheckbox = document.getElementById('gdpr')
    const errorMessage = document.getElementById('error-message')

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

    if (!emailRegex.test(email)) {
        errorMessage.textContent = 'Please enter a valid email address.'
        errorMessage.style.display = 'block'
    } else if (!gdprCheckbox.checked) {
        errorMessage.textContent = 'You must agree to the GDPR terms.'
        errorMessage.style.display = 'block'
    } else {
        errorMessage.style.display = 'none'
        alert('Subscription successful! Thank you for signing up.')
        document.getElementById('subscription-form').reset()
    }
})
