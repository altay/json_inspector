var JSON_INSPECTOR = new function() {
    var t0=new Date();
    var url = document.location.href;
    var disabled = url.match(/disable_json_inspector/); // append #disable_json_inspector to the url to switch it off
    var force_enable = url.match(/enable_json_inspector/); // append #enable_json_inspector to the url to switch it on
    alert(force_enable);
    var url_regexes = [/\.json/, /json$/, /\/json\//, /=json/];
    var url_matches;
    for (var i=0, re;re=url_regexes[i];i++) { if (!disabled && url.match(re)) { url_matches = true; } }
    if (url_matches || force_enable) {
    alert(force_enable);
        if (document.body.innerHTML.replace(/[\n\r\t ]/g, '')[0]=='<') { return false; }
        var json_str = document.body.innerText;
        document.getElementsByTagName('body')[0].className="json_inspector_body";
        document.body.innerHTML = "<div id='json_inspector_infobar'><table><tr><td id='json_inspector_logo'>JSON INSPECTOR</td><td id='infobar_controls'>"+url+
            "<br /> <span id='save_instruct' style='display:none'>(Right Click -> \"Save Link As...\")</span> "+
            '<a onmouseover="document.getElementById(\'save_instruct\').style.display=\'inline\';" href="'+url+'">Save</a> '+
            '<a href="#" onclick="window.open(\''+url+'#disable_json_inspector\');return false;">Disable</a> '+
            ' <a href="#" onclick="document.getElementById(\'json_inspector_infobar\').className=\'copy_on\';return false;" class="turn_on_copy">Copy</a> '+
            ' <a href="#" onclick="document.getElementById(\'json_inspector_infobar\').className=\'\';return false;" class="turn_off_copy">Hide raw JSON</a> '+
            "</td></tr></table><div id='copypaste'><textarea onclick='this.select()'>"+json_str+"</textarea></div></div>"+
            "<div id='json_inspector'><div id='json_inspector_content'><div id='json_inspector_loader'>"+parse_error()+
            "</div></div><p class='json_inspector_timing'>Completed in <span id='timing'>-</span>ms</p></div>";
        var the_json = eval("("+json_str+")");
        var consumers = {
            "array": function(v) { 
                var collapsed_html = " <a href='#' class='collapsed showlink'>[ ";
                var html = "<table class='array'>";
                collapsed_html += v.join(', ');
                for (var i=0;i<v.length;i++) { 
                    html += consume(i, v[i]);
                }
                collapsed_html += " ] ("+v.length+" items)</a>"
                html += "</table><a href='#' class='hidelink'>hide</a>";
                return ("<div class='visible'>"+collapsed_html+html+"</div>"); 
            }, 
            "object": function(v) { 
                var collapsed_html = " <a href='#' class='collapsed showlink'>{ ";
                var html = "<table class='object'>";
                for (i in v) {
                    collapsed_html += (i+" : "+v[i]+", ");
                    html += consume(i, v[i]);
                }
                collapsed_html += " }</a>"
                html += "</table><a href='#' class='hidelink'>hide</a>";
                return ("<div class='visible'>"+collapsed_html+html+"</div>"); 
            },
            "string": function(v) { return ("<span class='value string'>\""+v+"\"</span>"); },
            "number": function(v) { return ("<span class='value number'>"+v+"</span>"); },
            "boolean": function(v) { return ("<span class='value boolean'>"+(v ? "false" : "true")+"</span>"); }
        }
        function obj_class(obj) { return obj.constructor.name.toLowerCase(); };
        function consume(k,v) {
            return ("<tr><td class='key'>"+k+"</td>"+
                        "<td class='separator'> : </td> "+
                        (v==undefined ? "<td class='value null'>null</td>" : ("<td>"+consumers[obj_class(v)](v)+"</td>")));
        }
        function parse_error() {
            var html = "<div class='visible error'><strong>Yikes! JSON Inspector couldn't parse this response. "+
                '<a href="#" onclick="window.open(\''+ url+'#disable_json_inspector\');return false;">Disable JSON Inspector</a></strong>';
            html += "<br /><textarea>"+json_str+"</textarea>";
            html += "</div>";
            return html
        }
        var the_html = (the_json==undefined ? parse_error() : consumers[obj_class(the_json)](the_json))

        var inspector_content = document.getElementById('json_inspector_content');
        inspector_content.innerHTML=the_html;
        var anchors = document.getElementsByTagName('a'); // activate hide+show links
        for (var i=0, anchor; anchor=anchors[i]; i++) {
            if (anchor.className.match(/showlink/) || anchor.className.match(/hidelink/)) {
                anchor.onclick = function() { 
                    var div = this.parentNode; 
                    div.className = (div.className=='visible' ? 'hidden' : 'visible');
                    return false;
                }
            }
        }
        var t1 = new Date();
        document.getElementById('timing').innerHTML = (t1-t0);
    }
    else { // look for json links on the page
        var anchors = document.getElementsByTagName('a');
        for (var i=0, anchor; anchor=anchors[i]; i++) {
            if (anchor.href.match(/json/)) {
                anchor.target = "_blank";
            }
        }
    }
}
