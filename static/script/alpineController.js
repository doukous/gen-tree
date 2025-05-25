import GenealogicalTree from "./canvas/trees/GenealogicalTree.js";

document.addEventListener("alpine:init", () => {
  Alpine.directive("name", (el, { expression }, { evaluateLater, effect }) => {
    let currentValue = evaluateLater("$store.newChildren.formNumber");

    const setName = () => {
      const listEl = expression.split("-");
      const itemsList = [
        ...el.parentNode.parentNode.getElementsByTagName("fieldset"),
      ];

      listEl[1] = itemsList.indexOf(el.parentNode);
      el.setAttribute("name", listEl.join("-"));
    };

    setName();

    effect(() => {
      currentValue(() => {
        setName();
      });
    });
  });

  Alpine.store("form", {
    visible: true,

    open() {
      this.visible = !this.visible;
    },

    close(evt) {
      this.visible = !this.visible;
      evt.target.parentNode.remove(evt.target);
    },
  });

  Alpine.data("zoom", () => ({
    zoomIn() {
      GenealogicalTree.zoomIn();
    },

    zoomOut() {
      GenealogicalTree.zoomOut();
    },
  }));

  Alpine.data("newPartner", (sex) => ({
    rendered: false,
    partner: sex,

    handleDisplay(evt) {
      if (!this.rendered) {
        const template = document
          .getElementById(`new-${sex}-partner`)
          .content.cloneNode(true);

        console.log(template);

        evt.target.parentNode.appendChild(template);
        this.rendered = true;
      } else {
        evt.target.parentNode.remove();
        this.rendered = false;
      }
    },
  }));

  Alpine.store("newChildren", {
    formNumber: 0,
    formNumberEl: document.getElementById("id_new_children-TOTAL_FORMS"),

    add(evt) {
      const template = document
        .getElementById("new-child")
        .content.cloneNode(true);

      evt.target.parentNode.insertBefore(
        template,
        document.getElementById("add-children-btn")
      );
      document
        .getElementById("id_new_children-TOTAL_FORMS")
        .setAttribute("value", ++this.formNumber);
    },

    cancel(evt) {
      evt.target.parentNode.remove(evt.target);
      formNumberEl.setAttribute("value", --this.formNumber);
    },
  });
});
