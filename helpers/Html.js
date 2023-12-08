class Html{
    // heading
    h1(value='', _class=''){ return '<h1 class="'+_class+'">'+value+'</h1>'; }
    h2(value='', _class=''){ return '<h2 class="'+_class+'">'+value+'</h2>'; }
    h3(value='', _class=''){ return '<h3 class="'+_class+'">'+value+'</h3>'; }
    h4(value='', _class=''){ return '<h4 class="'+_class+'">'+value+'</h4>'; }
    h5(value='', _class=''){ return '<h5 class="'+_class+'">'+value+'</h5>'; }
    h6(value='', _class=''){ return '<h6 class="'+_class+'">'+value+'</h6>'; }

    // table
    td(value, _class=''){ return '<td class="'+_class+'">' + value +'</td>'; }
    th(value, _class='', width=''){ return '<th class="'+_class+'" width="'+width+'">' + value +'</th>'; }
    tr(value=[], id=''){ return '<tr id="tr_'+id+'">' + value + '</tr>';}
    thead(value=[]){ return '<thead>'+value+'</thead>'; }
    tbody(value=[]){ return '<tbody>'+value+'</tbody>'; }
    table(thead='', tbody='', _class='table table-bordered'){ return '<table class="'+_class+'">'+thead + tbody +'</table>';}

    // form
    form(value='', id='formData'){ return '<form id="'+id+'">'+value+'</form>'; }
    input(type='text', _class='', id='', value='', placeholder='', require=false, disabled=false, event=''){ return '<input type="'+type+'" class="'+_class+'" id="'+id+'" name="'+id+'" value="'+value+'" placeholder="'+placeholder+'"'+(require==true?' required':'')+(disabled==true?' disabled':'')+' '+event+' />';}
    option(value='', name='', selected=''){ return '<option value="'+value+'" '+selected+'>' + name + '</option>'; }
    select(array=[], _class='', id='', value='', event='', valueDefault='__Chọn__'){
        let str='<option value="">'+valueDefault+'</option>'; 
        for (let index = 0; index < array.length; index++) { 
            let selected = '';
            if(value!=null){ selected = (array[index]['value']==value.toString()) ? 'selected':''}
            str+=this.option(array[index]['value'], array[index]['name'], selected)
        } 
        return '<select class="'+_class+'" id="'+id+'" name="'+id+'" '+event+'>' + str + '</select>'; 
    }
    textarea(rows=3, value='', _class='', id='', placeholder=''){ return '<textarea rows="'+rows+'" class="'+_class+'" id="'+id+'" name="'+id+'" placeholder="'+placeholder+'">' + value + '</textarea>'; }
    submit(_class='', value=''){ return '<button type="submit" class="'+_class+'">'+value+'</button>'; }
    button(value='',_class='', _add='', _event=''){ return '<button type="button" class="btn '+_class+'" '+_add+' onclick="'+_event+'">'+value+'</button>'; }
    label(name='', _class=''){ return '<label class="'+_class+'">'+name+'</label>'; }
    ckeditor(rows=3, value='', _class='', id='', placeholder=''){ return '<textarea rows="'+rows+'" class="'+_class+'" id="'+id+'" placeholder="'+placeholder+'">' + value + '</textarea>'; }

    // link
    a(value='', link='', _class='nav-link', target=''){ return '<a href="'+link+'" class="'+_class+'" target="'+target+'">' + value + '</a>';}

    // list
    li(value='', _class='nav-item'){ return '<li class="'+_class+'">' + value + '</li>'; }
    ul(array=[], _class='nav pcoded-inner-navbar'){ return '<ul class="'+_class+'">' + array + '</ul>'; }

    // different
    span(_class='', value=''){ return '<span class="'+_class+'">'+value+'</span>'; }
    icon(_class=''){ return '<i class="feather icon-'+_class+'"></i>'; }
    div(_class='', value='', id=''){ return '<div class="'+_class+'" id="'+id+'">' +value+ '</div>'; }
    p(_class='', value=''){ return '<p class="'+_class+'">' +value+ '</p>'; }
    section(_class='', value=''){ return '<section class="'+_class+'">' +value+ '</section>'; }
    image(_class='image', src='', modal='', id=''){ return '<img src="'+src+'" class="'+_class+'" '+(modal!=''?'data-bs-toggle="modal" data-bs-target="#imageModal" onClick="getImage('+"'"+src+"'"+','+"'"+id+"'"+')"':'')+'/>'; }
    spiner(_color=''){ return '<div class="spinner-border '+_color+'" role="status"> <span class="sr-only">Loading...</span> </div>'; }
    status(id, checked=''){ return this.div('switch d-inline', '<input type="checkbox" '+checked+' class="switcher-input" name="validation-status" id="status-'+id+'" onChange="status('+"'"+id+"'"+','+"'status'"+')"><label for="status-'+id+'" class="cr"></label>') }
    float(id, checked=''){ return this.div('switch d-inline', '<input type="checkbox" '+checked+' class="switcher-input" name="validation-float" id="float-'+id+'" onChange="status('+"'"+id+"'"+','+"'float'"+')"><label for="float-'+id+'" class="cr"></label>') }
}
module.exports = new Html