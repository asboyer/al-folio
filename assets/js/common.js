function showEmailCopiedToast() {
  var toast = document.getElementById("email-copied-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "email-copied-toast";
    toast.textContent = "email copied to clipboard";
    document.body.appendChild(toast);
  }
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 1800);
}

$(document).ready(function () {
  // add toggle functionality to abstract, award and bibtex buttons
  $("a.abstract").click(function () {
    $(this).parent().parent().find(".abstract.hidden").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.award").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.bibtex").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden").toggleClass("open");
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
      offset: 100,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });

  // Email protection: transform mailto links into obfuscated elements
  if (document.body.dataset.protectEmail) {
    $("a[href^='mailto:']").each(function () {
      var email = $(this).attr("href").replace("mailto:", "");
      var parts = email.split("@");
      if (parts.length === 2) {
        $(this).attr("href", "#").addClass("email-protect").attr("data-eu", parts[0]).attr("data-ed", parts[1]);
      }
    });
  }

  // Email protection: copy to clipboard on click
  $(".email-protect").on("click", function (e) {
    e.preventDefault();
    var eu = $(this).data("eu");
    var ed = $(this).data("ed");
    var email = eu + "@" + ed;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(showEmailCopiedToast);
    } else {
      var ta = document.createElement("textarea");
      ta.value = email;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showEmailCopiedToast();
    }
  });
});
