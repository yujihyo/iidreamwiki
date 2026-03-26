document.addEventListener("DOMContentLoaded", function () {

  // ----------------------------
  // 자동 목차 생성
  // ----------------------------
  const tocList = document.getElementById("toc-list");
  const tocToggle = document.getElementById("toc-toggle");
  const tocBody = document.getElementById("toc-body");

  if (tocList) {
    tocList.innerHTML = "";

    const headings = document.querySelectorAll("h2, h3");
    let h2Count = 0;
    let h3Count = 0;
    let currentSublist = null;

    headings.forEach((heading, index) => {
      const text = heading.textContent.trim();

      if (!text) return;
      if (heading.closest(".footnotes-section")) return;

      const id = heading.id || "section-" + index;
      heading.id = id;

      let headingNumber = "";

      if (heading.tagName.toLowerCase() === "h2") {
        h2Count++;
        h3Count = 0;
        headingNumber = h2Count + ".";
      }

      if (heading.tagName.toLowerCase() === "h3") {
        h3Count++;
        headingNumber = h2Count + "." + h3Count + ".";
      }

      if (!heading.querySelector(".section-number")) {
        const headingNumLink = document.createElement("a");
        headingNumLink.href = "#toc";
        headingNumLink.className = "section-number";
        headingNumLink.textContent = headingNumber + " ";

        heading.prepend(headingNumLink);
      }

      if (heading.tagName.toLowerCase() === "h2") {
        const li = document.createElement("li");

        const numLink = document.createElement("a");
        numLink.href = "#" + id;
        numLink.className = "toc-num";
        numLink.textContent = headingNumber;

        const textSpan = document.createElement("span");
        textSpan.className = "toc-text";
        textSpan.textContent = text;

        li.appendChild(numLink);
        li.appendChild(textSpan);
        tocList.appendChild(li);

        currentSublist = document.createElement("ol");
        currentSublist.className = "toc-sublist";
        li.appendChild(currentSublist);
      }

      if (heading.tagName.toLowerCase() === "h3" && currentSublist) {
        const li = document.createElement("li");

        const numLink = document.createElement("a");
        numLink.href = "#" + id;
        numLink.className = "toc-num";
        numLink.textContent = headingNumber;

        const textSpan = document.createElement("span");
        textSpan.className = "toc-text";
        textSpan.textContent = text;

        li.appendChild(numLink);
        li.appendChild(textSpan);
        currentSublist.appendChild(li);
      }
    });
  }

  if (tocToggle && tocBody) {
    tocToggle.addEventListener("click", function () {
      const isHidden = tocBody.classList.toggle("hidden");
      tocToggle.classList.toggle("collapsed", isHidden);
      tocToggle.setAttribute("aria-expanded", String(!isHidden));
    });
  }

  // ----------------------------
  // 각주 시스템
  // ----------------------------
  const footnotes = document.querySelectorAll(".footnote");
  const footnotesList = document.getElementById("footnotes-list");

  if (!footnotes.length || !footnotesList) {
    return;
  }

  const tooltip = document.createElement("div");
  tooltip.className = "footnote-tooltip";
  tooltip.dataset.current = "";
  document.body.appendChild(tooltip);

  function isTouchDevice() {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }

  function positionTooltip(refLink, placeBelow = false) {
    const rect = refLink.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportWidth = window.innerWidth;
    const margin = 12;

    let left = rect.left + scrollX + rect.width / 2 - tooltip.offsetWidth / 2;
    let top = placeBelow
      ? rect.bottom + scrollY + 10
      : rect.top + scrollY - tooltip.offsetHeight - 10;

    const minLeft = scrollX + margin;
    const maxLeft = scrollX + viewportWidth - tooltip.offsetWidth - margin;

    if (left < minLeft) {
      left = minLeft;
    }

    if (left > maxLeft) {
      left = maxLeft;
    }

    if (!placeBelow && top < scrollY + margin) {
      top = rect.bottom + scrollY + 10;
    }

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
  }

  footnotes.forEach((footnote, index) => {
    const number = index + 1;
    const noteText = footnote.dataset.note || "";

    // 본문 쪽 각주 링크 생성
    const refId = "footnote-ref-" + number;
    const noteId = "footnote-note-" + number;

    const refLink = document.createElement("a");
    refLink.href = "#" + noteId;
    refLink.className = "footnote-ref";
    refLink.id = refId;
    refLink.textContent = "[" + number + "]";

    footnote.replaceWith(refLink);

    // 아래 각주 목록 생성
    const li = document.createElement("li");
    li.id = noteId;

    const numberSpan = document.createElement("span");
    numberSpan.className = "footnote-note-number";

    const backLink = document.createElement("a");
    backLink.href = "#" + refId;
    backLink.className = "footnote-backlink";
    backLink.textContent = "[" + number + "]";

    numberSpan.appendChild(backLink);

    const noteSpan = document.createElement("span");
    noteSpan.innerHTML = noteText;

    li.appendChild(numberSpan);
    li.appendChild(noteSpan);
    footnotesList.appendChild(li);

    // 웹: hover 시 툴팁
    refLink.addEventListener("mouseenter", function () {
      if (isTouchDevice()) return;

      tooltip.innerHTML = noteText;
      tooltip.style.display = "block";
      tooltip.dataset.current = refId;

      positionTooltip(refLink, false);
    });

    refLink.addEventListener("mouseleave", function () {
      if (isTouchDevice()) return;

      tooltip.style.display = "none";
      tooltip.dataset.current = "";
    });

    // 모바일: 클릭 시 툴팁만 표시, 이동 막기
    // 웹: 클릭 시 기존처럼 각주 위치로 이동
    refLink.addEventListener("click", function (e) {
      if (isTouchDevice()) {
        e.preventDefault();

        if (tooltip.style.display === "block" && tooltip.dataset.current === refId) {
          tooltip.style.display = "none";
          tooltip.dataset.current = "";
          return;
        }

        tooltip.innerHTML = noteText;
        tooltip.style.display = "block";
        tooltip.dataset.current = refId;

        positionTooltip(refLink, true);
      } else {
        tooltip.style.display = "none";
        tooltip.dataset.current = "";
      }
    });
  });

  // 모바일에서 각주/툴팁 바깥 클릭 시 닫기
  document.addEventListener("click", function (e) {
    if (!isTouchDevice()) return;

    if (!e.target.closest(".footnote-ref") && !e.target.closest(".footnote-tooltip")) {
      tooltip.style.display = "none";
      tooltip.dataset.current = "";
    }
  });

});

document.querySelectorAll(".spoiler-inline").forEach(btn => {
  let touched = false;

  function toggleSpoiler(e) {
    e.preventDefault();

    if (e.type === "click" && touched) {
      touched = false;
      return;
    }

    if (e.type === "touchend") {
      touched = true;
    }

    const content = btn.nextElementSibling;
    if (!content || !content.classList.contains("spoiler-content")) return;

    const isHidden = getComputedStyle(content).display === "none";

    if (isHidden) {
      content.style.display = "inline-block";
    } else {
      content.style.display = "none";
    }
  }

  btn.addEventListener("click", toggleSpoiler);
  btn.addEventListener("touchend", toggleSpoiler);
});