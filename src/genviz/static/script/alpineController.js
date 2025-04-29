document.addEventListener('alpine:init', () => {
    Alpine.data('addBtn', () => ({
        visible: true,

        toggle() {
            this.visible = ! this.visible
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
        numberOfChildren: 0,

        get firstname() {
            return `new_children-${this.numberOfChildren}-firstname`
        },

        get birthDate() {
            return `new_children-${this.numberOfChildren}-birth_date`
        },

        get sex() {
            return `new_children-${this.numberOfChildren}-sex`
        },

        add(evt) {
            this.numberOfChildren++
            
            const template = document
            .getElementById('new-child')
            .content
            .cloneNode(true)

            evt.target.parentNode.appendChild(template)
        },

        cancel(evt) {
            evt.target.parentNode.remove(evt.target)
            this.numberOfChildren--
        }
    })
})