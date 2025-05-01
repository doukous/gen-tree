import GenealogicalTree from "./canvas/trees/GenealogicalTree.js";


document.addEventListener('alpine:init', () => {
    Alpine.data('form', () => ({
        visible: true,

        open() {
            this.visible = ! this.visible
        },

        close(evt) {
            this.visible = ! this.visible
            evt.target.parentNode.remove(evt.target)
        }
    }))

    Alpine.data('zoom', () => ({
        zoomIn() {
            GenealogicalTree.zoomIn()
        },

        zoomOut() {
            GenealogicalTree.zoomOut()
        }
    }))

    Alpine.data('newPartner', (partner) => ({
        rendered: false,
        partnerType: partner,

        handleDisplay(evt) {
            if (! this.rendered) {
                this.rendered = true

                const template = document
                .getElementById(`new-${this.partnerType}-partner`)
                .content
                .cloneNode(true)

                evt.target.parentNode.appendChild(template)
            }

            else {
                const higherNode = evt.target.parentNode.parentNode
                higherNode.removeChild(evt.target.parentNode)
                this.rendered = false
            }
        }
    }))

    Alpine.store('newChildren', {
        add(evt) {            
            const template = document
            .getElementById('new-child')
            .content
            .cloneNode(true)

            evt.target.parentNode.appendChild(template)
        },

        cancel(evt) {
            evt.target.parentNode.remove(evt.target)
        }
    })
})