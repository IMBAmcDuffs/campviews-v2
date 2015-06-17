var formBuilder = {
  makeField: function(field_obj) {
	  
    switch(field_obj.meta_value.field_type){
      case 'text':
        return formBuilder.textField(field_obj);
      break;
      case 'textarea':
        return formBuilder.textAreaField(field_obj);
      break;
      case 'dropdown':
        return formBuilder.dropdownField(field_obj);
      break;
    }
  },
  textField: function(field) {
	  console.log(field);
    return '<label for="field_'+field.meta_id+'" class="item item-input item-stacked-label"><span class="input-label">'+field.meta_value.label+'</span><input type="text" name="field_'+field.meta_id+'" id="field_'+field.meta_id+'" value="" placeholder="'+field.meta_value.placeholder+'" /></label>';
  },
  textAreaField: function(field) {
    return '<label for="field_'+field.meta_id+'" class="item item-input item-stacked-label"><span class="input-label">'+field.meta_value.label+'</span><textarea name="field_'+field.meta_id+'" id="field_'+field.meta_id+'" placeholder="'+field.meta_value.placeholder+'"></textarea></label>';
  },
  dropdownField: function(field) {
    var out = '<div class="form-field"><label for="field_'+field.meta_id+'">'+field.meta_value.label+'</label>';
    out += '<select name="field_'+field.meta_id+'" id="field_'+field.meta_id+'">';
    for(var key in field.meta_value.options) {
        var option = field.meta_value.options[key];
        out += '<option value="'+option.value+'">'+option.label+'</option>';
    }
    out += '</select></div>';
    return out;
  }
};