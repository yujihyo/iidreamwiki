document.querySelectorAll("h2").forEach(function (title) {

    let anchor = document.createElement("a");

    anchor.href = "#" + title.id;

    anchor.style.color = "#999";
    anchor.style.fontSize = "14px";
    anchor.style.textDecoration = "none";

    title.appendChild(anchor);

});

document.addEventListener("DOMContentLoaded", function () {

    const tocList = document.getElementById("toc-list");

    if (!tocList) return;

    const headings = document.querySelectorAll("h2");

    headings.forEach((heading, index) => {

        const id = "section-" + index;

        heading.id = id;

        const li = document.createElement("li");

        const a = document.createElement("a");

        a.href = "#" + id;
        a.textContent = heading.textContent;

        li.appendChild(a);

        tocList.appendChild(li);

    });

});

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
    let currentH2Li = null;
    let currentSublist = null;

    headings.forEach((heading, index) => {
      const text = heading.textContent.trim();

      if (!text) return;
      if (heading.closest(".footnotes-section")) return;

      const id = heading.id || "section-" + index;
      heading.id = id;

      if (heading.tagName.toLowerCase() === "h2") {
        h2Count++;
        h3Count = 0;

        const li = document.createElement("li");

        const numLink = document.createElement("a");
        numLink.href = "#" + id;
        numLink.className = "toc-num";
        numLink.textContent = h2Count + ".";

        const textSpan = document.createElement("span");
        textSpan.className = "toc-text";
        textSpan.textContent = text;

        li.appendChild(numLink);
        li.appendChild(textSpan);
        tocList.appendChild(li);

        currentH2Li = li;
        currentSublist = document.createElement("ol");
        currentSublist.className = "toc-sublist";
        li.appendChild(currentSublist);
      }

      if (heading.tagName.toLowerCase() === "h3" && currentSublist) {
        h3Count++;

        const li = document.createElement("li");

        const numLink = document.createElement("a");
        numLink.href = "#" + id;
        numLink.className = "toc-num";
        numLink.textContent = h2Count + "." + h3Count + ".";

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
  document.body.appendChild(tooltip);

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
    noteSpan.textContent = noteText;

    li.appendChild(numberSpan);
    li.appendChild(noteSpan);
    footnotesList.appendChild(li);

    // hover 시 툴팁 표시
    refLink.addEventListener("mouseenter", function () {
      tooltip.textContent = noteText;
      tooltip.style.display = "block";

      const rect = refLink.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      tooltip.style.left = (rect.left + scrollX + 12) + "px";
      tooltip.style.top = (rect.bottom + scrollY + 10) + "px";
    });

    refLink.addEventListener("mousemove", function (e) {
      tooltip.style.left = (e.pageX + 12) + "px";
      tooltip.style.top = (e.pageY + 12) + "px";
    });

    refLink.addEventListener("mouseleave", function () {
      tooltip.style.display = "none";
    });

    refLink.addEventListener("click", function () {
      tooltip.style.display = "none";
    });
  });
});