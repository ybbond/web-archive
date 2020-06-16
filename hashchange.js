if (document) {
  window.addEventListener("hashchange", () => {
    const body = document.getElementsByTagName("body");
    const filterBy = document.getElementById("filter-by");

    const allItems = document.getElementsByClassName("item");
    const allTagItems = document.getElementsByClassName("tagitem");
    for (let el of allItems) {
      el.removeAttribute("isActive");
    }
    for (let el of allTagItems) {
      el.removeAttribute("isActive");
    }

    if (location.hash && location.hash !== "#") {
      const hash = location.hash.slice(1);
      const allAffected = document.getElementsByClassName(hash);
      for (let el of allAffected) {
        el.setAttribute("isActive", "");
      }
      for (let el of body) {
        el.setAttribute("filterTag", "");
      }
      filterBy.innerHTML = `filtered by ${location.hash}`;
    } else {
      for (let el of body) {
        el.removeAttribute("filterTag");
      }
      filterBy.innerHTML = null;
    }
  });
}
