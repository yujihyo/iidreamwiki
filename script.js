document.addEventListener("DOMContentLoaded", function () {

  // ----------------------------
  // 자동 목차 생성
  // ----------------------------
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
      const titleLink = heading.querySelector("a:not(.section-number)");
      const text = titleLink
        ? titleLink.textContent.trim()
        : heading.textContent.trim();

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

        let textNode;

        if (titleLink) {
          textNode = document.createElement("a");
          textNode.href = titleLink.getAttribute("href");
          textNode.className = "toc-text";
          textNode.textContent = text;

          if (titleLink.target) {
            textNode.target = titleLink.target;
          }

          if (titleLink.rel) {
            textNode.rel = titleLink.rel;
          }
        } else {
          textNode = document.createElement("span");
          textNode.className = "toc-text";
          textNode.textContent = text;
        }

        li.appendChild(numLink);
        li.appendChild(textNode);
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

        let textNode;

        if (titleLink) {
          textNode = document.createElement("a");
          textNode.href = titleLink.getAttribute("href");
          textNode.className = "toc-text";
          textNode.textContent = text;

          if (titleLink.target) {
            textNode.target = titleLink.target;
          }

          if (titleLink.rel) {
            textNode.rel = titleLink.rel;
          }
        } else {
          textNode = document.createElement("span");
          textNode.className = "toc-text";
          textNode.textContent = text;
        }

        li.appendChild(numLink);
        li.appendChild(textNode);
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
  document.body.appendChild(tooltip);

  footnotes.forEach((footnote, index) => {
  const number = index + 1;
  const noteText = footnote.dataset.note || "";
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

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

    function showFootnoteTooltip(target, html, preferredPosition) {
    tooltip.innerHTML = html;
    tooltip.style.display = "block";

    const rect = target.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const margin = 8;

    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;

    let left = rect.left + scrollX + (rect.width / 2) - (tooltipWidth / 2);

    const minLeft = scrollX + margin;
    const maxLeft = scrollX + window.innerWidth - tooltipWidth - margin;

    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    let top;

    if (preferredPosition === "above") {
      if (spaceAbove >= tooltipHeight + 10) {
        top = rect.top + scrollY - tooltipHeight - 10;
      } else {
        top = rect.bottom + scrollY + 10;
      }
    } else {
      if (spaceBelow >= tooltipHeight + 10) {
        top = rect.bottom + scrollY + 10;
      } else {
        top = rect.top + scrollY - tooltipHeight - 10;
      }
    }

    const minTop = scrollY + margin;
    const maxTop = scrollY + window.innerHeight - tooltipHeight - margin;

    if (top < minTop) top = minTop;
    if (top > maxTop) top = maxTop;

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
  }

  refLink.addEventListener("mouseenter", function () {
    if (isTouchDevice) return;
    showFootnoteTooltip(refLink, noteText, "above");
  });

  refLink.addEventListener("mouseleave", function () {
    if (isTouchDevice) return;
    tooltip.style.display = "none";
    tooltip.dataset.current = "";
  });

  refLink.addEventListener("click", function (e) {
    if (isTouchDevice) {
      e.preventDefault();

      if (tooltip.style.display === "block" && tooltip.dataset.current === refId) {
        tooltip.style.display = "none";
        tooltip.dataset.current = "";
        return;
      }

      tooltip.dataset.current = refId;
      showFootnoteTooltip(refLink, noteText, "below");
    } else {
      tooltip.style.display = "none";
      tooltip.dataset.current = "";
    }
  });
});
});

document.querySelectorAll(".spoiler-inline").forEach(btn => {
  btn.addEventListener("click", function () {
    const content = this.nextElementSibling;

    if (getComputedStyle(content).display === "none") {
      content.style.display = "inline";
    } else {
      content.style.display = "none";
    }
  });
});

document.addEventListener("click", function (e) {
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  if (!isTouchDevice) return;

  if (!e.target.closest(".footnote-ref") && !e.target.closest(".footnote-tooltip")) {
    tooltip.style.display = "none";
    tooltip.dataset.current = "";
  }
});
