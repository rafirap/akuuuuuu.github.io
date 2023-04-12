var socket=io();var url=window.location.pathname.split("/");var counterpart=window.location.hash.split("/");function SafeText(text){text=text.replace(/</g,"&lt;");text=text.replace(/>/g,"&gt;");return text;}
function GetCookie(cname){let name=cname+"=";let decodedCookie=decodeURIComponent(document.cookie);let ca=decodedCookie.split(';');for(let i=0;i<ca.length;i++){let c=ca[i];while(c.charAt(0)==' '){c=c.substring(1);}
if(c.indexOf(name)==0){return c.substring(name.length,c.length);}}
return "";}
var CurrentTimer;function ProgressBar(){var old=$("#bar").width();$("#bar").width(old+1);}
function FinishBar(){var total=$("#bartotal").width();$("#bar").width(total);}
function ResetBar(){$("#bar").width(0);}
function StartLoading(){CurrentTimer=setInterval(ProgressBar,1)}
function StopLoading(){clearInterval(CurrentTimer);FinishBar();setTimeout(ResetBar,200);}
function SearchItems(search=""){console.log("Do be "+search)
if(search==""){search=$("#searchitems").val();}
$("#searchitems").val(search);window.history.pushState('items',`${SafeText(search)} - Dream Ninjas`,`/tools/items#/search/${search}`);document.title=`Search: ${SafeText(search)} - Dream Ninjas`;StartLoading();socket.emit("searchItems",search);}
function SelectItem(itemid){StartLoading();socket.emit("getItem",itemid);}
function HandlePageChange(){url=window.location.pathname.split("/");counterpart=window.location.hash.split("/");if(!url[1]||url[1]==""||url[1]=="home"){if(!url[2]||url[2]==""||url[2]=="home"){socket.emit("getVersion");socket.emit("getModsGuardians");setInterval(function(){socket.emit("getModsGuardians");},120000);}}
if(url[1]=="tools"){if(url[2]=="items"){socket.emit("getItemCount");switch(counterpart[1]){case "search":if(counterpart[2]==""){socket.emit("getItemCount");}else{SearchItems(decodeURI(counterpart[2]));}
break;case "item":if(counterpart[2]||counterpart[2]!=""){SelectItem(decodeURI(counterpart[2]));}
break;}}else if(url[2]=="xpcalc"){CalculateXP();}}
if(url[1]=="scanner"){if(url[2]=="files"){var filehash=counterpart[1];if(filehash){socket.emit("getFile",filehash);}else{socket.emit("getFiles");}}}}
HandlePageChange();$(window).on('hashchange',function(e){HandlePageChange();});$("input[readonly='readonly']").click(function(){$(this).select();});$("textarea[readonly='readonly']").click(function(){$(this).select();});function ToggleMenu(){if($(".mobile-menu:visible").length){$(".mobile-menu").fadeOut(100);}else{$(".mobile-menu").fadeIn(100);}}
function CopyShareable(){url=window.location.pathname.split("/");counterpart=window.location.hash.split("/");if(url[2]=="items"){let itemid=counterpart[2];if(itemid){let copyurl=`${location.origin}/embed/items/${itemid}`;navigator.clipboard.writeText(copyurl);notif(`Copied ${copyurl} to Clipboard.`,"success");}}}
$("#searchitems").keypress(function(event){var keycode=(event.keyCode?event.keyCode:event.which);if(keycode=='13'){SearchItems();}});function waitfor(selector){return new Promise(resolve=>{if(document.querySelector(selector)){return resolve(document.querySelector(selector));}
const observer=new MutationObserver(mutations=>{if(document.querySelector(selector)){resolve(document.querySelector(selector));observer.disconnect();}});observer.observe(document.body,{childList:true,subtree:true});});}
function notif(text,type="info"){switch(type){case "success":$("#notif").html(`<div id="alert" class="alert success"><strong>Success</strong> ${text}</div>`);break;case "warning":$("#notif").html(`<div id="alert" class="alert warning"><strong>Warning</strong> ;${text}</div>`);break;case "error":$("#notif").html(`<div id="alert" class="alert"><strong>Error</strong> ${text}</div>`);break;default:$("#notif").html(`<div id="alert" class="alert info"><strong>Info</strong> ${text}</div>`);}
setTimeout(function(){$("#alert").fadeOut(2000);},5000)}
function CategoryDecode(cat){switch(cat){case 0:return "0 <span style='color:grey;'>(Breakable Items)</span>";case 2:return "2 <span style='color:grey;'>(Returns to Backpack)</span>";case 4:return "4 <span style='color:grey;'>(Unobtainable)</span>";case 5:return "5 <span style='color:grey;'>(Summer Clash Unobtainable)</span>";case 6:return "6 <span style='color:grey;'>(Destructo Ray)</span>";case 7:return "7 <span style='color:grey;'>(Valhowla Treasure)</span>";case 8:return "8 <span style='color:grey;'>(Multiple Tree Drop Items)</span>";case 16:return "16 <span style='color:grey;'>(Special Properties)</span>";case 32:return "32 <span style='color:grey;'>(Shop Pack Bought Items)</span>";case 34:return "32 <span style='color:grey;'>(Player Modifying Blocks)</span>";case 36:return "32 <span style='color:grey;'>(Unobtainable)</span>";case 40:return "40 <span style='color:grey;'>(Heroic Boots)</span>";case 64:return "64 <span style='color:grey;'>(Winterfest Items)</span>";case 66:return "66 <span style='color:grey;'>(Winterfest Weathers)</span>";case 96:return "96 <span style='color:grey;'>(Winterfest Special)</span>";default:return cat+" <span style='color:grey;'>(Unknown)</span>";}}
function CollisionDecode(col){if(col==0){return "0 <span style='color:grey;'>(No Collision)</span>";}else if(col==1){return "2 <span style='color:grey;'>(Full Collision)</span>";}else if(col==4){return "4 <span style='color:grey;'>(Toggleable Collision)</span>";}else{return col+" <span style='color:grey;'>(Unknown)</span>";}}
function GetFile(hash){socket.emit("getFile",hash);}
function GetIcon(filename){var file=filename.split(".");var extension=file[file.length-1];switch(extension){case 'exe':return 'mdi-file-export';case 'bin':return 'mdi-file-export';case 'txt':return 'mdi-file-document';case 'doc':return 'mdi-file-document';case 'jar':return 'mdi-language-java';case 'dll':return 'mdi-file-settings-variant';default:return 'mdi-file-question';}}
function FormatDetections(detections){if(detections.length==0){return `<span style='color: grey !important'>No Detections</span>`;}
let finalhtml=``;for(let detection of detections){if(detection.startsWith("Using.")){finalhtml=finalhtml+`<span style='color: #ffd800 !important'><i class='mdi mdi-alert'></i> ${detection}</span><br>`;}
if(detection.startsWith("Obfuscation.")){finalhtml=finalhtml+`<span style='color: #ffd800 !important'><i class='mdi mdi-alert'></i> ${detection}</span><br>`;}
if(detection.startsWith("Encrypted.")){finalhtml=finalhtml+`<span style='color: #ffd800 !important'><i class='mdi mdi-alert'></i> ${detection}</span><br>`;}
if(detection.startsWith("FileSteal.")){finalhtml=finalhtml+`<span style='color: #FF001F !important'><i class='mdi mdi-close-circle'></i> ${detection}</span><br>`;}
if(detection.startsWith("Botnet.")){finalhtml=finalhtml+`<span style='color: #FF001F !important'><i class='mdi mdi-close-circle'></i> ${detection}</span><br>`;}
if(detection.startsWith("Keylogger.")){finalhtml=finalhtml+`<span style='color: #FF001F !important'><i class='mdi mdi-close-circle'></i> ${detection}</span><br>`;}
if(detection.startsWith("Rat.")){finalhtml=finalhtml+`<span style='color: #FF001F !important'><i class='mdi mdi-close-circle'></i> ${detection}</span><br>`;}
if(detection.startsWith("Ransomware.")){finalhtml=finalhtml+`<span style='color: #FF001F !important'><i class='mdi mdi-close-circle'></i> ${detection}</span><br>`;}
if(detection.startsWith("Backdoor.")){finalhtml=finalhtml+`<span style='color: #FF001F !important'><i class='mdi mdi-close-circle'></i> ${detection}</span><br>`;}
if(detection.startsWith("Net.")){finalhtml=finalhtml+`<span style='color: #2CBF42 !important'><i class='mdi mdi-check-circle'></i> ${detection}</span><br>`;}
if(detection.startsWith("Verified.")){finalhtml=finalhtml+`<span style='color: #6e14ce !important'><i class='mdi mdi-shield-check'></i> ${detection}</span><br>`;}
if(detection.startsWith("FileType.")){finalhtml=finalhtml+`<span style='color: #2CBF42 !important'><i class='mdi mdi-check-circle'></i> ${detection}</span><br>`;}
if(detection.startsWith("Comodo.")){finalhtml=finalhtml+`<span style='color: #2CBF42 !important'><i class='mdi mdi-check-circle'></i> ${detection}</span><br>`;}
if(detection.startsWith("Trainer.")){finalhtml=finalhtml+`<span style='color: #2CBF42 !important'><i class='mdi mdi-check-circle'></i> ${detection}</span><br>`;}
if(detection.startsWith("Adware.")){finalhtml=finalhtml+`<span style='color: #FF001F !important'><i class='mdi mdi-close-circle'></i> ${detection}</span><br>`;}
if(detection.startsWith("Packed.")){finalhtml=finalhtml+`<span style='color: #ffd800 !important'><i class='mdi mdi-alert'></i> ${detection}</span><br>`;}
if(detection.startsWith("Malicious.")){finalhtml=finalhtml+`<span style='color: #FF001F !important'><i class='mdi mdi-close-circle'></i> ${detection}</span><br>`;}}
return finalhtml;}
function HumanFileSize(bytes,si=false,dp=1){const thresh=si?1000:1024;if(Math.abs(bytes)<thresh){return bytes+' B';}
const units=si?['kB','MB','GB','TB','PB','EB','ZB','YB']:['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];let u=-1;const r=10**dp;do{bytes/=thresh;++u;}while(Math.round(Math.abs(bytes)*r)/r>=thresh&&u<units.length-1);return bytes.toFixed(dp)+' '+units[u];}
function FormatScore(score,detections){if(detections.includes("Verified.")){return `<span style="color: #6e14ce !important" title='Hash Matches Verified File'><i class="mdi mdi-shield-check"></i> <span class="mobile-hide">Verified File</span></span>`;}
if(score>13){return `<span style='color: #FF001F !important' title='Score of ${score}'><i style="vertical-align: middle;" class='mdi mdi-close-circle'></i> <span class="mobile-hide">Very Dangerous</span></span>`;}else if(score>10){return `<span style='color: #FF001F !important' title='Score of ${score}'><i style="vertical-align: middle;" class='mdi mdi-close-circle'></i> <span class="mobile-hide">Dangerous</span></span>`;}else if(score>6){return `<span style='color: #ff6b26 !important' title='Score of ${score}'><i style="vertical-align: middle;" class='mdi mdi-alert'></i> <span class="mobile-hide">Very Suspicious</span></span>`;}else if(score>3){return `<span style='color: #ffd800 !important' title='Score of ${score}'><i style="vertical-align: middle;" class='mdi mdi-alert'></i> <span class="mobile-hide">Suspicious</span></span>`;}else if(score>0){return `<span style='color: #2CBF42 !important' title='Score of ${score}'><i style="vertical-align: middle;" class='mdi mdi-check-circle'></i> <span class="mobile-hide">Likely Okay</span></span>`;}else{return `<span style='color: #72bcd4 !important' title='Score of ${score}'><i style="vertical-align: middle;" class="mdi mdi-minus-circle"></i> <span class="mobile-hide">No Detections</span></span>`;}}
socket.on("getFile",function(info){window.history.pushState('files',`${SafeText(info.filename)} - Dream Ninjas`,`/scanner/files#/${info.md5}`);var extra=info.extra.split("\n");var finalhtml=`
    <div class="box-heading">File Information</div>
    <div class="spacer"></div>`;finalhtml=finalhtml+`
    <div class="box big file">
        <div class="info">
                <div class="tts">
                    <i class="mdi ${GetIcon(info.filename)}"></i>
                </div>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td class="ttl">MD5</td>
                                <td class="overflow">${info.md5}</td>
                            </tr>
                            <tr>
                                <td class="ttl">SHA256</td>
                                <td class="overflow">${info.sha256}</td>
                            </tr>
                            <tr>
                                <td class="ttl">Filename</td>
                                <td class="overflow">${info.filename}</td>
                            </tr>
                            <tr>
                                <td class="ttl">Size</td>
                                <td class="overflow">${HumanFileSize(info.size)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
    </div>
    <div class="spacer"></div>`;if(info.detections.length>1&&info.detections[0].startsWith("Verified.")){finalhtml=finalhtml+`
        <div class="generic">
            <div class="icon" style="color:#6e14ce !important;"><i class="mdi mdi-shield-check"></i></div>
            <div class="information">
                <div class="title">Verified</div>
                <div class="desc">
                    This file has been verified by the Dream Ninjas team.
                </div>
            </div>
        </div>
        <div class="spacer"></div>`;}
finalhtml=finalhtml+`
    <div class="box-heading">File Detections</div>
    <div class="spacer"></div>
    <div class="box big">
        <div class="body">
            ${FormatDetections(info.detections)}
        </div>
    </div>`;var count={}
if(extra.length>1){finalhtml=finalhtml+`
        <div class="spacer"></div>
        <div class="box-heading">Extra Information</div>
        <div class="spacer"></div><div class="box big"><div class="body"><table class="vertical">`;for(let entry of extra){if(!entry||entry==""){continue;}
let stuff=entry.split(": ");if(!count[stuff[0]]||count[stuff[0]]==0){count[stuff[0]]=1;}else{count[stuff[0]]++;}
finalhtml=finalhtml+`<tr><th>${stuff[0].replace(/Using./g,"")} ${count[stuff[0]]}</td><td>${stuff[1]}</td></tr>`;}
finalhtml=finalhtml+`</table></div></div>`;}
$("#filecontent").html(finalhtml);});function FormatCategory(cat){switch(cat){case "Multi Facing":return `<span class="tag blue"><i class="mdi mdi-arrow-left-right"></i> ${cat}</span>`;case "Editable":return `<span class="tag green"><i class="mdi mdi-pencil"></i> ${cat}</span>`;case "Seedless":return `<span class="tag red"><i class="mdi mdi-seed"></i><i class="mdi mdi-close"></i> ${cat}</span>`;case "Permanent":return `<span class="tag orange"><i class="mdi mdi-lock"></i> ${cat}</span>`;case "Auto Pickup":return `<span class="tag lightblue"><i class="mdi mdi-dresser"></i> ${cat}</span>`;case "Dropless":return `<span class="tag lightgreen"><i class="mdi mdi-debug-step-into"></i><i class="mdi mdi-close"></i> ${cat}</span>`;case "No Self":return `<span class="tag lightred"><i class="mdi mdi-account-off"></i> ${cat}</span>`;case "No Shadow":return `<span class="tag lightorange"><i class="mdi mdi-box-shadow"></i><i class="mdi mdi-close"></i> ${cat}</span>`;case "World Locked":return `<span class="tag purple"><i class="mdi mdi-web"></i> ${cat}</span>`;case "Foreground":return `<span class="tag yellow"><i class="mdi mdi-arrange-bring-forward"></i> ${cat}</span>`;case "Rand Grow":return `<span class="tag royal"><i class="mdi mdi-code-braces"></i> ${cat}</span>`;case "Mod":return `<span class="tag mango"><i class="mdi mdi-account-cog"></i> ${cat}</span>`;case "Public":return `<span class="tag darkgreen"><i class="mdi mdi-parking"></i> ${cat}</span>`;case "Holiday":return `<span class="tag darkblue"><i class="mdi mdi-pine-tree"></i> ${cat}</span>`;case "Untradeable":return `<span class="tag darkred"><i class="mdi mdi-store"></i> ${cat}</span>`;case "Transmutable":return `<span class="tag pink"><i class="mdi mdi-settings-transfer"></i> ${cat}</span>`;}}
socket.on("getFiles",function(files,score){var finalhtml=``;for(var file of files){finalhtml=finalhtml+`<div class="entry" onclick="GetFile('${file.md5}')">
            <div class="filegrid">
                <div style="">${FormatScore(file.score,file.detections.join("\n"))}</div>
                <div class="file-entry overflow">${file.filename}</div>
                <div class="mobile-hide">${HumanFileSize(file.size)}</div>
                <div class="mobile-hide">${file.md5}</div>
            </div>
            
        </div>
        <div class="spacer"></div>`}
$("#filecontent").html(finalhtml);})
socket.on("error",function(text){notif(text,"error");StopLoading();console.log(text);});socket.on("getItem",function(iteminfo){if(!iteminfo.block.itemID){notif("Item does not exist.","error");return;}
window.history.pushState('items',`${iteminfo.block.itemID} - Dream Ninjas`,`/tools/items#/item/${iteminfo.block.itemID}`);document.title=`${iteminfo.block.name} - Dream Ninjas`;window.scrollTo(0,0);var finalextrahtml="";var finalbcathtml=`<div class="inline-spacer"></div>`;var finalscathtml=`<div class="inline-spacer"></div>`;var formattedsplicing=``;if(iteminfo.info.extra){for(let extra of iteminfo.info.extra){finalextrahtml=finalextrahtml+`
            <div class="box">
                <div class="body">
                    ${extra}
                </div>
            </div>

            <div class="spacer"></div>
            `;}
if(iteminfo.info.splicing!=""){formattedsplicing=iteminfo.info.splicing.replace("\n",`&nbsp;<span style="color:rgb(159,159,159);font-weight: bold;">+</span>`);}else{formattedsplicing="Not Splicable"}
for(let bcat of iteminfo.block.categories){finalbcathtml=finalbcathtml+`${FormatCategory(bcat)}&nbsp;`;}
for(let scat of iteminfo.seed.categories){finalscathtml=finalscathtml+`${FormatCategory(scat)}&nbsp;`;}
$("#itemcontent").html(`
        <img src="/textures/${iteminfo.block.texture.replace(".rttex",".png")}" style="display: none;" id="blocksprites">
        <div class="box">
            <div class="title">Basic Info</div>
            <div class="body">
                <div style="float:right;margin-top: 10px;padding-right: 1px;"><a class="button small" onclick="CopyShareable()" title="This will copy a link that will display information in Discord and other platforms."><i class="mdi mdi-clipboard-multiple"></i> Copy Link</a></div>
                <div style="padding-left: 5px; padding-right: 5px;display: grid; grid-template-columns: 32px auto; grid-gap: 10px;">
                    <div style=""><canvas id="block_sprite" width="32" height="32"></canvas></div>
                    <div style="vertical-align: middle;margin: auto 0;font-size:25px;font-weight:bold">
                        ${iteminfo.block.name}
                    </div>
                </div>
                <div style="padding-left: 5px;padding-top: 20px;">${iteminfo.info.description}</div>
                <div style="padding-left: 5px;padding-top: 20px;">${iteminfo.info.properties.replace(/\n/g,"<br>")}</div>
                <div class="spacer"></div>
                <table class="vertical">
                    <tr>
                        <th>Item ID</th>
                        <th>Rarity</th>
                    </tr>
                    <tr>
                        <td>${iteminfo.block.itemID}</td>
                        <td>${iteminfo.block.rarity}</td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <th>Tile Type</th>
                        <th>Collision Type</th>
                    </tr>
                    <tr>
                        <td>${iteminfo.info.type}</td>
                        <td>${CollisionDecode(iteminfo.block.collisionType)}</td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <th>Chi</th>
                        <th>Texture Type</th>
                    </tr>
                    <tr>
                        <td>${iteminfo.info.chi}</td>
                        <td>${iteminfo.info.texturetype}</td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <th>Break Properties</th>
                        <th>Seed Color</th>
                    </tr>
                    <tr>
                        <td>
                            <div style="display:grid;grid-template-columns: 19px auto;grid-gap:5px;">
                                <div><img src="/assets/fist.png" style="width:19px;"></div>
                                <div>${iteminfo.info.hardness.fist}</div>
                            </div>
                            <div style="display:grid;grid-template-columns: 19px auto;grid-gap:5px;">
                                <div><img src="/assets/pickaxe.png" style="width:19px;"></div>
                                <div>${iteminfo.info.hardness.pickaxe}</div>
                            </div>
                            ${iteminfo.info.hardness.restores}
                        </td>
                        <td>
                            <div style="display:grid;grid-template-columns: 19px auto;grid-gap:5px;">
                                <div style="background-color:${iteminfo.info.seed.color1};border-radius:50%;height:100%;width:100%;"></div>
                                <div>${iteminfo.info.seed.color1}</div>
                            </div>
                            
                            <div style="display:grid;grid-template-columns: 19px auto;grid-gap:5px;">
                                <div style="background-color:${iteminfo.info.seed.color2};border-radius:50%;height:100%;width:100%;"></div>
                                <div>${iteminfo.info.seed.color2}</div>
                            </div>
                        </td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <th>Grow Time</th>
                        <th>Gem Drop</th>
                    </tr>
                    <tr>
                        <td>${iteminfo.info.growtime}</td>
                        <td>
                            <div style="display:grid;grid-template-columns: 19px auto;grid-gap:5px;">
                                <div><img src="/assets/gem.png" style="width:19px;"></div>
                                <div>${iteminfo.info.gemsdrop}</div>
                            </div>
                        </td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <td colspan="2"><span style="color:rgb(159,159,159);font-weight: bold;">Splicing:</span>&nbsp;&nbsp;${formattedsplicing}</td>
                    </tr>
                </table>
                
                <div style="padding-left: 5px;padding-bottom:5px;">${finalbcathtml}</div>
            </div>
        </div>

        <div class="spacer"></div>

        ${finalextrahtml}

        <div class="box">
            <div class="title">Seed Info</div>
            <div class="body">
                <h2 style="padding-left: 5px;">${iteminfo.seed.name}</h2>
                <div class="spacer"></div>
                <table class="vertical">
                    <tr>
                        <th>Item ID</th>
                        <th>Rarity</th>
                    </tr>
                    <tr>
                        <td>${iteminfo.seed.itemID}</td>
                        <td>${iteminfo.seed.rarity}</td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <th>Collision Type</th>
                    </tr>
                    <tr>
                        <td>${CollisionDecode(iteminfo.seed.collisionType)}</td>
                    </tr>
                </table>
                <div style="padding-left: 5px;padding-bottom:5px;">${finalscathtml}</div>
            </div>
        </div>
        
        <script>
        waitfor("#blocksprites").then((elm) => {
            $("#blocksprites").on("load", function(){
                var canvas = document.getElementById("block_sprite");
                var contex = canvas.getContext("2d");
                var img = document.getElementById("blocksprites");
                contex.drawImage(img, -${iteminfo.block.textureX*32}, -${iteminfo.block.textureY*32});
            })
        });
        hljs.highlightAll();
        </script>`);StopLoading();}else{$("#itemcontent").html(`
        <img src="/textures/${iteminfo.block.texture.replace(".rttex",".png")}" style="display: none;" id="blocksprites">
        <img src="/textures/${iteminfo.seed.texture.replace(".rttex",".png")}" style="display: none;" id="seedsprites">
        <div class="box">
            <div class="title">Basic Info</div>
            <div class="body">
                <div style="padding-left: 5px; padding-right: 5px;display: grid; grid-template-columns: 32px auto; grid-gap: 10px;">
                    <div style=""><canvas id="block_sprite" width="32" height="32"></canvas></div>
                    <div style="vertical-align: middle;margin: auto 0;font-size:25px;font-weight:bold">
                        ${iteminfo.block.name}
                    </div>
                </div>
                <div style="padding-left: 5px;padding-top: 20px;">No info.</div>
                <div style="padding-left: 5px;padding-top: 20px;">This item has no known properties.</div>
                <div class="spacer"></div>
                <table class="vertical">
                    <tr>
                        <th>Item ID</th>
                        <th>Rarity</th>
                    </tr>
                    <tr>
                        <td>${iteminfo.block.itemID}</td>
                        <td>${iteminfo.block.rarity}</td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <th>Collision Type</th>
                    </tr>
                    <tr>
                        <td>${CollisionDecode(iteminfo.block.collisionType)}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="spacer"></div>

        <div class="box">
            <div class="title">Seed Info</div>
            <div class="body">
                <h2>${iteminfo.seed.name}</h2>
                <div class="spacer"></div>
                <table class="vertical">
                    <tr>
                        <th>Item ID</th>
                        <th>Rarity</th>
                    </tr>
                    <tr>
                        <td>${iteminfo.seed.itemID}</td>
                        <td>${iteminfo.seed.rarity}</td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <th>Collision Type</th>
                    </tr>
                    <tr>
                        <td>${CollisionDecode(iteminfo.seed.collisionType)}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="spacer"></div>
        

        <div class="box">
            <div class="title">JSON</div>
            <div class="body">
                <pre style="overflow: auto; max-width: 100%"><code style="" class="language-json">${JSON.stringify(iteminfo,null,'\t')}</code></pre>
            </div>
        </div>

        <script>
        waitfor("#blocksprites").then((elm) => {
            $("#blocksprites").on("load", function(){
                var canvas = document.getElementById("block_sprite");
                var contex = canvas.getContext("2d");
                var img = document.getElementById("blocksprites");
                contex.drawImage(img, -${iteminfo.block.textureX*32}, -${iteminfo.block.textureY*32});
            })
        });
        hljs.highlightAll();
        </script>`);StopLoading();}})
socket.on("getItemCount",function(count,version){$("#totalitems").html(count);$("#itemsversion").html(version);})
socket.on("searchItems",function(data){var finalhtml="";for(var item of data.items){finalhtml=finalhtml+`
        <div class="entry" onclick="SelectItem('${item.itemID}')">
            <div class="title">${item.name}</div>
            <div><i class="mdi mdi-xml secondary"></i> ${item.itemID}</div>
        </div>
        <div class="spacer"></div>
        `;}
$("#itemcontent").html(finalhtml);StopLoading();});socket.on("getVersion",function(version){$("#gtversion").html(version);});socket.on("getModsGuardians",function(info){let lastdate=new Date(info.lastupdate);let modsguardians=info.modsguardians;let finalhtml=`<table class="simple small">`
if(modsguardians.length==0){finalhtml=finalhtml+`<tr><th colspan="2">None online</th></tr>`;}else{for(var mg of modsguardians){finalhtml=finalhtml+`<tr><th><i class="mdi mdi-circle" style="color: rgb(38, 237, 38)"></i> ${mg.name}</th><td>${mg.type.replace("mod","Moderator").replace("guardian","Guardian")}</td></tr>`;}}
finalhtml=finalhtml+`<tr><td></td></tr><tr><th colspan="2" style="font-size: 10px;">Updated ${lastdate.toLocaleDateString('en-us',{month:"short",day:"numeric",hour:"numeric",minute:"numeric",year:"numeric"})}</th></tr></table>`;$("#modsguardians").html(finalhtml);})
function DeobPiterP(){var code=$("#scriptinput").val();socket.emit("DeobPiterP",code);}
socket.on("DeobPiterP",function(code){$("#scriptoutput").val(code);});function CalculateXP(){var wantlvl=$("#wantlvl").val();var curlvl=$("#curlvl").val();var curxp=$("#curxp").val();socket.emit("calcXP",curlvl,wantlvl,curxp);}
socket.on("calcXP",function(neededxp,extra,curlvl,wantlvl){$("#lvloutput").html(`<div class="box">
        <div class="title">Output</div>
        <div class="body">
            <div style="font-size: 20px;"><b>${neededxp.toLocaleString()}</b> XP to go from <b>Level ${curlvl}</b> to <b>Level ${wantlvl}</b>.</div>
            <div class="inline-spacer"></div>
            <div class="inline-spacer"></div>
            This is the equivalent of:
            <div class="inline-spacer"></div>
            <div class="inline-spacer"></div>
            <table style="vertical">
                <tr>
                    <td>
                        <div style="display:grid;grid-template-columns: 19px auto;grid-gap:5px;">
                            <div><img src="/assets/sugarcane.png" style="width:19px;"></div>
                            <div>Breaking <span style="font-weight: bold;" title="${extra.sugarcane}">${Math.ceil(extra.sugarcane).toLocaleString()}</span> Sugar Cane.</div>
                        </div>

                        <div class="inline-spacer"></div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div style="display:grid;grid-template-columns: 19px auto;grid-gap:5px;">
                            <div><img src="/assets/fishtank.png" style="width:19px;"></div>
                            <div>Breaking <span style="font-weight: bold;" title="${extra.fishtank}">${Math.ceil(extra.fishtank).toLocaleString()}</span> Fish Tank.</div>
                        </div>

                        <div class="inline-spacer"></div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div style="display:grid;grid-template-columns: 19px auto;grid-gap:5px;">
                            <div><img src="/assets/pepper.png" style="width:19px;"></div>
                            <div>Breaking <span style="font-weight: bold;" title="${extra.pepper}">${Math.ceil(extra.pepper).toLocaleString()}</span> Pepper Tree.</div>
                        </div>

                        <div class="inline-spacer"></div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div style="display:grid;grid-template-columns: 19px auto;grid-gap:5px;">
                            <div><img src="/assets/lasergrid.png" style="width:19px;"></div>
                            <div>Breaking <span style="font-weight: bold;" title="${extra.lasergrid}">${Math.ceil(extra.lasergrid).toLocaleString()}</span> Laser Grid.</div>
                        </div>

                        <div class="inline-spacer"></div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div style="display:grid;grid-template-columns: 19px auto;grid-gap:5px;">
                            <div><img src="/assets/chandelier.png" style="width:19px;"></div>
                            <div>Breaking <span style="font-weight: bold;" title="${extra.chandelier}">${Math.ceil(extra.chandelier).toLocaleString()}</span> Chandelier.</div>
                        </div>

                        <div class="inline-spacer"></div>
                    </td>
                </tr>
            </table>
        </div>
    </div>`);});setTimeout(function(){console.log("%cStop Skidding - Dream Ninjas","color: lime; font-size: 20px");},2000);if(new Date().getMonth()==11){console.log("%cMerry %cChristmas!","color: red; font-size: 20px","color: green; font-size: 20px");var SnowStatus=localStorage.getItem("SnowStatus");if(SnowStatus===null){SnowSatus="on";localStorage.setItem("SnowStatus","on");$(".logo").html(`${$(".logo").html()} <i onclick="ToggleSnow()" class="mdi mdi-snowflake christmas"></i>`);}else if(SnowStatus=="off"){snowStorm.freeze();$(".logo").html(`${$(".logo").html()} <i onclick="ToggleSnow()" class="mdi mdi-snowflake-melt christmas"></i>`);}else if(SnowStatus=="on"){$(".logo").html(`${$(".logo").html()} <i onclick="ToggleSnow()" class="mdi mdi-snowflake christmas"></i>`);}
function ToggleSnow(){if(SnowStatus=="on"){localStorage.setItem("SnowStatus","off");SnowStatus="off";location.reload();}else{localStorage.setItem("SnowStatus","on");SnowStatus="on";location.reload();}}}else{snowStorm.freeze();}