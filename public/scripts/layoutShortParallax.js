// node_modules/simple-parallax-js/dist/vanilla/simpleParallaxVanilla.es.js
var h = (i) => NodeList.prototype.isPrototypeOf(i) || HTMLCollection.prototype.isPrototypeOf(i) ? Array.from(i) : typeof i == "string" || i instanceof String ? document.querySelectorAll(i) : [i];
var d = () => Element.prototype.closest && "IntersectionObserver" in window;
var c = class {
  constructor() {
    this.positions = {
      top: 0,
      bottom: 0,
      height: 0
    };
  }
  setViewportTop(t) {
    return this.positions.top = t ? t.scrollTop : window.pageYOffset, this.positions;
  }
  setViewportBottom() {
    return this.positions.bottom = this.positions.top + this.positions.height, this.positions;
  }
  setViewportAll(t) {
    return this.positions.top = t ? t.scrollTop : window.pageYOffset, this.positions.height = t ? t.clientHeight : document.documentElement.clientHeight, this.positions.bottom = this.positions.top + this.positions.height, this.positions;
  }
};
var s = new c();
var m = () => {
  const i = "transform webkitTransform mozTransform oTransform msTransform".split(" ");
  let t, e = 0;
  for (; t === void 0; )
    t = document.createElement("div").style[i[e]] !== void 0 ? i[e] : void 0, e += 1;
  return t;
};
var r = m();
var p = (i) => i.tagName.toLowerCase() !== "img" && i.tagName.toLowerCase() !== "picture" ? true : !(!i || !i.complete || typeof i.naturalWidth < "u" && i.naturalWidth === 0);
var f = class {
  constructor(t, e, n = false) {
    this.element = t, this.elementContainer = t, this.settings = e, this.isVisible = true, this.isInit = false, this.oldTranslateValue = -1, this.prefersReducedMotion = n, this.init = this.init.bind(this), this.customWrapper = this.settings.customWrapper && this.element.closest(this.settings.customWrapper) ? this.element.closest(this.settings.customWrapper) : null, !this.prefersReducedMotion && (p(t) ? this.init() : this.element.addEventListener("load", () => {
      setTimeout(() => {
        this.init(true);
      }, 50);
    }));
  }
  init(t) {
    this.prefersReducedMotion || this.isInit || (t && (this.rangeMax = null), !this.element.closest(".simpleParallax") && (this.settings.overflow === false && this.wrapElement(this.element), this.setTransformCSS(), this.getElementOffset(), this.intersectionObserver(), this.getTranslateValue(), this.animate(), this.settings.delay > 0 ? setTimeout(() => {
      this.setTransitionCSS(), this.elementContainer.classList.add("simple-parallax-initialized");
    }, 10) : this.elementContainer.classList.add("simple-parallax-initialized"), this.isInit = true));
  }
  // if overflow option is set to false
  // wrap the element into a .simpleParallax div and apply overflow hidden to hide the image excedant (result of the scale)
  wrapElement() {
    const t = this.element.closest("picture") || this.element;
    let e = this.customWrapper || document.createElement("div");
    e.classList.add("simpleParallax"), e.style.overflow = "hidden", this.customWrapper || (t.parentNode.insertBefore(e, t), e.appendChild(t)), this.elementContainer = e;
  }
  // unwrap the element from .simpleParallax wrapper container
  unWrapElement() {
    const t = this.elementContainer;
    this.customWrapper ? (t.classList.remove("simpleParallax"), t.style.overflow = "") : t.replaceWith(...t.childNodes);
  }
  // apply default style on element
  setTransformCSS() {
    this.settings.overflow === false && (this.element.style[r] = `scale(${this.settings.scale})`), this.element.style.willChange = "transform";
  }
  // apply the transition effect
  setTransitionCSS() {
    this.element.style.transition = `transform ${this.settings.delay}s ${this.settings.transition}`;
  }
  // remove style of the element
  unSetStyle() {
    this.element.style.willChange = "", this.element.style[r] = "", this.element.style.transition = "";
  }
  // get the current element offset
  getElementOffset() {
    const t = this.elementContainer.getBoundingClientRect();
    if (this.elementHeight = t.height, this.elementTop = t.top + s.positions.top, this.settings.customContainer) {
      const e = this.settings.customContainer.getBoundingClientRect();
      this.elementTop = t.top - e.top + s.positions.top;
    }
    this.elementBottom = this.elementHeight + this.elementTop;
  }
  // build the Threshold array to cater change for every pixel scrolled
  buildThresholdList() {
    const t = [];
    for (let e = 1; e <= this.elementHeight; e++) {
      const n = e / this.elementHeight;
      t.push(n);
    }
    return t;
  }
  // create the Intersection Observer
  intersectionObserver() {
    const t = {
      root: null,
      threshold: this.buildThresholdList()
    };
    this.observer = new IntersectionObserver(
      this.intersectionObserverCallback.bind(this),
      t
    ), this.observer.observe(this.element);
  }
  // Intersection Observer Callback to set the element at visible state or not
  intersectionObserverCallback(t) {
    t.forEach((e) => {
      e.isIntersecting ? this.isVisible = true : this.isVisible = false;
    });
  }
  // check if the current element is visible in the Viewport
  // for browser that not support Intersection Observer API
  checkIfVisible() {
    return this.elementBottom > s.positions.top && this.elementTop < s.positions.bottom;
  }
  // calculate the range between image will be translated
  getRangeMax() {
    const t = this.element.clientHeight;
    this.rangeMax = t * this.settings.scale - t;
  }
  // get the percentage and the translate value to apply on the element
  getTranslateValue() {
    let t = ((s.positions.bottom - this.elementTop) / ((s.positions.height + this.elementHeight) / 100)).toFixed(1);
    return t = Math.min(100, Math.max(0, t)), this.settings.maxTransition !== 0 && t > this.settings.maxTransition && (t = this.settings.maxTransition), this.oldPercentage === t || (this.rangeMax || this.getRangeMax(), this.translateValue = (t / 100 * this.rangeMax - this.rangeMax / 2).toFixed(0), this.oldTranslateValue === this.translateValue) ? false : (this.oldPercentage = t, this.oldTranslateValue = this.translateValue, true);
  }
  // animate the image
  animate() {
    let t = 0, e = 0, n;
    (this.settings.orientation.includes("left") || this.settings.orientation.includes("right")) && (e = `${this.settings.orientation.includes("left") ? this.translateValue * -1 : this.translateValue}px`), (this.settings.orientation.includes("up") || this.settings.orientation.includes("down")) && (t = `${this.settings.orientation.includes("up") ? this.translateValue * -1 : this.translateValue}px`), this.settings.overflow === false ? n = `translate3d(${e}, ${t}, 0) scale(${this.settings.scale})` : n = `translate3d(${e}, ${t}, 0)`, this.element.style[r] = n;
  }
};
var a = false;
var o = [];
var l;
var u;
var g = class {
  constructor(t, e) {
    t && d() && (this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches, this.reducedMotionMediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ), this.handleReducedMotionChange = this.handleReducedMotionChange.bind(this), this.reducedMotionMediaQuery.addEventListener(
      "change",
      this.handleReducedMotionChange
    ), !this.prefersReducedMotion && (this.elements = h(t), this.defaults = {
      delay: 0,
      orientation: "up",
      scale: 1.3,
      overflow: false,
      transition: "cubic-bezier(0,0,0,1)",
      customContainer: "",
      customWrapper: "",
      maxTransition: 0
    }, this.settings = Object.assign(this.defaults, e), this.settings.customContainer && ([this.customContainer] = h(this.settings.customContainer)), this.lastPosition = -1, this.resizeIsDone = this.resizeIsDone.bind(this), this.refresh = this.refresh.bind(this), this.proceedRequestAnimationFrame = this.proceedRequestAnimationFrame.bind(this), this.init()));
  }
  // Handle changes to reduced motion preference
  handleReducedMotionChange(t) {
    this.prefersReducedMotion = t.matches, this.prefersReducedMotion ? this.destroy() : this.init();
  }
  init() {
    this.prefersReducedMotion || (s.setViewportAll(this.customContainer), o = [
      ...this.elements.map(
        (t) => new f(
          t,
          this.settings,
          this.prefersReducedMotion
        )
      ),
      ...o
    ], a || (this.proceedRequestAnimationFrame(), window.addEventListener("resize", this.resizeIsDone), a = true));
  }
  // wait for resize to be completely done
  resizeIsDone() {
    clearTimeout(u), u = setTimeout(this.refresh, 200);
  }
  // animation frame
  proceedRequestAnimationFrame() {
    if (s.setViewportTop(this.customContainer), this.lastPosition === s.positions.top) {
      l = window.requestAnimationFrame(this.proceedRequestAnimationFrame);
      return;
    }
    s.setViewportBottom(), o.forEach((t) => {
      this.proceedElement(t);
    }), l = window.requestAnimationFrame(this.proceedRequestAnimationFrame), this.lastPosition = s.positions.top;
  }
  // proceed the element
  proceedElement(t) {
    let e = false;
    this.customContainer ? e = t.checkIfVisible() : e = t.isVisible, e && t.getTranslateValue() && t.animate();
  }
  refresh() {
    s.setViewportAll(this.customContainer), o.forEach((t) => {
      t.getElementOffset(), t.getRangeMax();
    }), this.lastPosition = -1;
  }
  destroy() {
    this.reducedMotionMediaQuery && this.reducedMotionMediaQuery.removeEventListener(
      "change",
      this.handleReducedMotionChange
    );
    const t = [];
    o = o.filter((e) => this.elements && this.elements.includes(e.element) ? (t.push(e), false) : e), t.forEach((e) => {
      e.unSetStyle(), this.settings && this.settings.overflow === false && e.unWrapElement();
    }), o.length || (window.cancelAnimationFrame(l), window.removeEventListener("resize", this.refresh), a = false);
  }
};

// src/scripts/layoutShortParallax.ts
document.addEventListener("DOMContentLoaded", () => {
  const image = document.getElementsByClassName("parallax-img");
  new g(image, { scale: 3 });
});
