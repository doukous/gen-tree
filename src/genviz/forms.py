from django import forms


class PersonForm(forms.Form):
    MEN_CHOICES = {
        ('', '---choisir---'),
        ('mohamed', 'Mohamed'),
        ('adama', 'Adama'),
        ('saliou', 'Saliou')
    }

    WOMEN_CHOICES = {
        ('', '---choisir---'),
        ('khadija', 'Khadija'),
        ('mareme', 'Mareme'),
        ('awa', 'Awa')
    }

    firstname = forms.CharField()
    birth_date = forms.DateField(
        widget=forms.DateInput(attrs={
           'type': 'date' 
        }),
        required=False
    )    


class ChildForm(PersonForm):
    SEX_CHOICES = {
        ('', '---choisir---'),
        ('male', 'Homme'),
        ('female', 'Femme')
    }

    sex = forms.ChoiceField(choices=SEX_CHOICES, initial='male', required=False)
    role = 'child'

ChildFormSet = forms.formset_factory(ChildForm, extra=0)


class FamilyForm(forms.Form):
    family_name = forms.CharField(initial='family name')

    first_partner_choice = forms.ChoiceField(
        choices=PersonForm.MEN_CHOICES, 
        required=False    
    )

    second_partner_choice = forms.ChoiceField(
        choices=PersonForm.WOMEN_CHOICES, 
        required=False
    )

    all_people = PersonForm.MEN_CHOICES.copy()
    all_people.update(PersonForm.WOMEN_CHOICES)

    children_choices = forms.MultipleChoiceField(
        choices=all_people, 
        required=False,
        initial=[""]
    )

    new_first_partner = PersonForm(initial={
        'firstname': 'first partner',
    }, prefix='first_partner')

    new_second_partner = PersonForm(initial={
        'firstname': 'second partner',
    }, prefix='second_partner')

    children = ChildFormSet(initial=[{
        'firstname': 'child name',
    }], prefix='child')


    def clean(self):
        remaining_data = self.data.copy()

        # it contains only the non-nested fields
        family_data = super().clean().copy()

        for family_key in list(self.cleaned_data.keys()):
            del remaining_data[family_key]

        new_first_partner = PersonForm(prefix='first_partner', data=remaining_data)
        new_second_partner = PersonForm(prefix='second_partner', data=remaining_data)
        
        new_first_partner.is_valid()
        new_second_partner.is_valid()

        for prefix in [new_first_partner.prefix, new_second_partner.prefix]:
            for partner_key in new_first_partner.fields:
                key = f"{prefix}-{partner_key}"
                del remaining_data[key]
        
        family_data['new_first_partner'] = new_first_partner.cleaned_data
        family_data['new_second_partner'] = new_second_partner.cleaned_data

        children = ChildFormSet(prefix='child', data=remaining_data)
        children.is_valid()

        family_data['children'] = children.cleaned_data

        return family_data
