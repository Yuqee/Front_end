import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
// import 'bootstrap';

let token = null;
let userId = null;
let channelId = null;
let channelMembers = null;
let msgIds = [];

const makeRequest = (route, method, body) => {
    const options = {
        method: method,
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
    };
    if(body !== undefined) {
        options.body = JSON.stringify(body);
    }
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5005' + route, options).then((raw_response) => {
            return raw_response.json();
        }).then((data) => {
            if(data.error){
                document.getElementById('modal-body').innerText = data.error;
                document.getElementById('modal-title').innerText = 'Error';
                $('#modal-info').modal('show');
            }else{
                resolve(data);
            }
        })
    })
};

document.getElementById('register-action').addEventListener('click', () => {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm_pw = document.getElementById('register-password-confirm').value;
    const name = document.getElementById('register-name').value;

    if(password === confirm_pw){
        makeRequest('/auth/register', 'POST', {
            email: email,
            password: password,
            name: name
        }).then((data) => {
            token = data.token;
            userId = data.userId;
            loggedin();
        });
    }else{
        document.getElementById('modal-body').innerText = "Passwords do NOT match";
        document.getElementById('modal-title').innerText = 'Error';
        $('#modal-info').modal('show');
    }
});

document.getElementById('login-action').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    makeRequest('/auth/login', 'POST', {
        email: email,
        password: password
    }).then((data) => {
        token = data.token;
        userId = data.userId;  
        loggedin();
    });
});

document.getElementById('logout-action').addEventListener('click', () => {
    makeRequest('/auth/logout', 'POST', {}).then(() => {
        loggedout();
        token = null;
        userId = null; 
    });
});

const checkMsg = (msg) => {
    if(!msg.replace(/\s/g, '').length){
        return true;
    }
    return false;
}

let base64_img = '';
document.getElementById('msgsend-img').addEventListener('change', () => {
    var file = document.querySelector('input[type=file]')['files'][0];

    var reader = new FileReader();
    
    reader.onload = function () {
        base64_img = reader.result.replace("data:", "").replace(/^.+,/, "");
        base64_img = 'data:image/png;base64,'+base64_img;
    }
    reader.readAsDataURL(file);
    // console.log(base64_img);
});

document.getElementById('msgsend-action').addEventListener('click', () => {
    const msg = document.getElementById('msgsend-text').value;
    
    if(base64_img!==''){
        makeRequest('/message/' + channelId, 'POST', {
            image : base64_img
        }).then(() => {
            base64_img = '';
            displayChannelDetails(channelId);
        });
    }else if(!checkMsg(msg)) {
        makeRequest('/message/' + channelId, 'POST', {
            message : msg,
        }).then(() => {
            document.getElementById('msgsend-text').value = '';
            displayChannelDetails(channelId);
        });
    } else {
        document.getElementById('modal-body').innerText = 'Message not valid!';
        document.getElementById('modal-title').innerText = 'Error';
        $('#modal-info').modal('show');
    }

    // if(checkMsg(msg)){
    //     document.getElementById('modal-body').innerText = 'Message not valid!';
    //     document.getElementById('modal-title').innerText = 'Error';
    //     $('#modal-info').modal('show');
    // }else if(base64_img!==''){
    //     makeRequest('/message/' + channelId, 'POST', {
    //         image : base64_img
    //     }).then(() => {
    //         base64_img = '';
    //         displayChannelDetails(channelId);
    //     });
    // }else{
    //     makeRequest('/message/' + channelId, 'POST', {
    //         message : msg,
    //     }).then(() => {
    //         document.getElementById('msgsend-text').value = '';
    //         displayChannelDetails(channelId);
    //     });
    // }

});

const createAppendEle = (parent, tag, id, value) => {
    const ele = document.createElement(tag);
    ele.setAttribute('id', id);
    if (value !== undefined && tag !== 'input') {
        ele.innerText = value;
    }
    if (tag === 'input') {
        ele.value = value;
        ele.setAttribute('type', 'text');
    } else if(tag === 'textarea') {
        ele.value = value;
    }
    parent.appendChild(ele);
}

const displayChannelDetails = (id) => {
    makeRequest('/channel/'+id, 'GET').then((data) => {
        const channel_members = data.members;
        makeRequest('/user/'+data.creator, 'GET').then((moredata) => {
            document.getElementById('channel-info').remove();
            createAppendEle(document.getElementById('channel-messages'), 'div', 'channel-info');
            const channel_info = document.getElementById('channel-info');

            channel_info.append("Name:");
            createAppendEle(channel_info, 'input', 'channel-name', data.name);
            channel_info.appendChild(document.createElement('br'));
            channel_info.append("Description:");
            channel_info.appendChild(document.createElement('br'));
            createAppendEle(channel_info, 'textarea', 'channel-des', data.description);
            createAppendEle(channel_info, 'h6', 'channel-setting', data.private);
            createAppendEle(channel_info, 'h6', 'channel-time', data.createdAt);
            createAppendEle(channel_info, 'h6', 'channel-creator', moredata.name);
            createAppendEle(channel_info, 'button', 'channel-edit-action', 'Edit');
            channel_info.appendChild(document.createElement('br'));
            channel_info.appendChild(document.createElement('br'));
            createAppendEle(channel_info, 'button', 'channel-invite-action', 'Invite');

            document.getElementById('channel-edit-action').addEventListener('click', () => {
                makeRequest('/channel/'+id, 'PUT', {
                    name: document.getElementById('channel-name').value,
                    description: document.getElementById('channel-des').value
                }).then(() => {
                    document.getElementById('modal-body').innerText = "Channel edited successfully.";
                    document.getElementById('modal-title').innerText = 'Success';
                    $('#modal-info').modal('show');
                });
            });

            document.getElementById('channel-invite-action').addEventListener('click', () => {
                const Users = [];
                makeRequest('/user', 'GET').then((otherdata) => {
                    while (document.getElementById('modal-invite-body').firstChild) {
                        document.getElementById('modal-invite-body').removeChild(document.getElementById('modal-invite-body').firstChild);
                    }
                    document.getElementById('modal-invite-body').append("Select the users you want to invite(if user is alreay a member of this channel, then you can't select him/her):");
                    document.getElementById('modal-invite-body').appendChild(document.createElement('br'));
                    let count_invite_users = 0;
                    
                    let pros = [];
                    for (const user of otherdata.users) {
                        const pro = makeRequest('/user/'+user.id, 'GET').then((moreotherdata) => {
                            Users.push(moreotherdata.name+user.id);
                        });
                        pros.push(pro);                     
                    }
                    
                    let UserIds = [];
                    Promise.all(pros).then(() => {
                        Users.sort();
                        for (const user of Users) {
                            const temp = document.getElementsByTagName("template")[1];
                            const check_box = temp.content.cloneNode(true);
                            document.getElementById('modal-invite-body').appendChild(check_box);
                            const check_box_n = document.getElementById('modal-invite-body').getElementsByTagName('div')[count_invite_users];
                            const check_box_input = check_box_n.getElementsByTagName('input')[0];
                            const check_box_label = check_box_n.getElementsByTagName('label')[0];
                            check_box_input.setAttribute('id', 'check-box'+count_invite_users);
                            const k = parseInt(user.length-5);
                            const id = user.slice(k, parseInt(user.length));
                            const name = user.slice(0, k);
                            UserIds.push(id);
                            if (channel_members.includes(parseInt(id))) {
                                check_box_input.setAttribute('disabled', 'true');
                            }
                            check_box_label.innerText = name;
                            count_invite_users++;
                        }
                        $('#modal-invite').modal('show');
                        document.getElementById('invite-action-invite').addEventListener('click', () => {
                            let checked_nums = [];
                            for (let i = 0; i < count_invite_users; i++) {
                                if (document.getElementById('check-box'+i).checked) {
                                    checked_nums.push(i);
                                }
                            }
                            for (const i of checked_nums) {
                                makeRequest('/channel/'+id+'/invite', 'POST', {
                                    userId: parseInt(UserIds[i])
                                }).then(() => {
                                    channel_members.push(parseInt(UserIds[i]));
                                });
                            }
                        });
                    })
                });
            });
            
            makeRequest('/message/'+id+'?start=0', 'GET').then((otherdata) => {
                msgIds = [];
                let image_msg = [];
                let senderIds = [];
                document.getElementById('channels').classList.add('hide');

                document.getElementById('channel-messages').classList.remove('hide');
                
                document.getElementById('channel-messages-body').remove();
                
                const channel_messages_body = document.createElement('ul');
                channel_messages_body.setAttribute('id', 'channel-messages-body');
                channel_messages_body.classList.add('list-unstyled');
                document.getElementById('channel-messages').appendChild(channel_messages_body);
                
                channel_messages_body.appendChild(document.createElement('hr'));
                                
                const heading1 = document.createElement('h3');
                heading1.innerText = 'Pinned Messages:';
                const pin_msg_box = document.createElement('div');
                pin_msg_box.setAttribute('id', 'pinned-messages');
                pin_msg_box.appendChild(heading1);
                channel_messages_body.appendChild(pin_msg_box);
                
                channel_messages_body.appendChild(document.createElement('hr'));
                const heading2 = document.createElement('h3');
                heading2.innerText = 'Other Messages:';
                const other_msg_box = document.createElement('div');
                other_msg_box.setAttribute('id', 'other-messages');
                other_msg_box.appendChild(heading2);
                channel_messages_body.appendChild(other_msg_box);

                let count = 0;
                let count_pin = 0;
                let count_other = 0;
                document.getElementById('channel-messages-body').appendChild(document.createElement('hr'));
                for (const message of otherdata.messages) {
                    const temp = document.getElementsByTagName("template")[0];
                    const msg_box = temp.content.cloneNode(true);
                    let msg_box_n = null;
                    if (message.pinned) {
                        document.getElementById('pinned-messages').appendChild(msg_box);  
                        msg_box_n = document.getElementById('pinned-messages').getElementsByTagName('div')[4*count_pin];
                        msg_box_n.setAttribute('id', 'msg-box'+count);
                        count_pin++;
                    } else {
                        document.getElementById('other-messages').appendChild(msg_box); 
                        msg_box_n = document.getElementById('other-messages').getElementsByTagName('div')[4*count_other]; 
                        msg_box_n.setAttribute('id', 'msg-box'+count);
                        count_other++;
                    }

                    const upper_box = msg_box_n.getElementsByTagName('div')[0];
                    const bottom_box = msg_box_n.getElementsByTagName('div')[1];
                    const msg_box_img = upper_box.getElementsByTagName('img')[0];
                    const msg_box_sender = bottom_box.getElementsByTagName('h4')[0];
                    msg_box_sender.setAttribute('id', 'sender'+count);
                    msg_box_sender.classList.add('channels');

                    const msg_box_time = bottom_box.getElementsByTagName('h6')[0];
                    const msg_box_msg = bottom_box.getElementsByTagName('p')[0];
                    msg_box_msg.setAttribute('id', 'box'+count);

                    const msg_box_delete = bottom_box.getElementsByTagName('a')[0];
                    msg_box_delete.style.color = 'red';
                    msg_box_delete.innerText = '[delete]';
                    msg_box_delete.classList.add('channels');
                    msg_box_delete.setAttribute('id', 'delete'+count);
                    msgIds.push(message.id);
                    senderIds.push(message.sender);

                    const msg_box_edit = bottom_box.getElementsByTagName('a')[1];
                    msg_box_edit.style.color = 'blue';
                    msg_box_edit.innerText = '[edit]';
                    msg_box_edit.classList.add('channels');
                    msg_box_edit.setAttribute('id', 'edit'+count);

                    const msg_box_pin = bottom_box.getElementsByTagName('span')[0];
                    msg_box_pin.setAttribute('id', 'pin'+count);
                    if(message.pinned){
                        msg_box_pin.style.textShadow = '0 0 0 red';
                    }

                    const msg_box_heart = bottom_box.getElementsByTagName('span')[1];
                    msg_box_heart.setAttribute('id', 'heart'+count);

                    const msg_box_thumb_up = bottom_box.getElementsByTagName('span')[2];
                    msg_box_thumb_up.setAttribute('id', 'thumb-up'+count);

                    const msg_box_thumb_down = bottom_box.getElementsByTagName('span')[3];
                    msg_box_thumb_down.setAttribute('id', 'thumb-down'+count);

                    if (message.reacts.length !== 0) {
                        for (const reaction of message.reacts) {
                            if (reaction.user === userId) {
                                if (reaction.react.includes('H')) {
                                    msg_box_heart.style.textShadow = '0 0 0 red';
                                } else if (reaction.react.includes('U')) {
                                    msg_box_thumb_up.style.textShadow = '0 0 0 red';
                                } else if (reaction.react.includes('D')) {
                                    msg_box_thumb_down.style.textShadow = '0 0 0 red';
                                }
                            }
                        }
                    }

                    makeRequest('/user/'+message.sender, 'GET').then((othermoredata) => {
                        msg_box_sender.innerText = othermoredata.name;
                        if (othermoredata.image !== null) {
                            msg_box_img.src = othermoredata.image;
                        } else {
                            msg_box_img.src = "../images/profile.png";
                        }
                    });
                    if (message.edited) {
                        msg_box_time.innerText = message.editedAt;
                    } else {
                        msg_box_time.innerText = message.sentAt;
                    }

                    
                    if (message.image !== undefined) {
                        const msg_box_image_msg = bottom_box.getElementsByTagName('img')[0];
                        msg_box_image_msg.src = message.image;
                        msg_box_image_msg.style.width = '100px';
                        msg_box_image_msg.classList.add('channels');
                        msg_box_image_msg.setAttribute('id', 'msg-box-image'+count);
                        image_msg.push(count);
                    } else {
                        msg_box_msg.innerText = message.message;
                    }
                    count++;
                }

                for (let i = 0; i < image_msg.length; i++) {
                    document.getElementById('msg-box-image'+image_msg[i]).addEventListener('click', () => {
                        let cur = i;
                        document.getElementById('modal-enlarge-image').src = document.getElementById('msg-box-image'+image_msg[i]).src;
                        document.getElementById('modal-enlarge-image').style.width = '400px';
                        $('#modal-enlarge').modal('show');
                        document.getElementById('last-image-action').addEventListener('click', () => {
                            if (cur < image_msg.length-1) {
                                cur++;
                                document.getElementById('modal-enlarge-image').src = document.getElementById('msg-box-image'+image_msg[cur]).src;
                                document.getElementById('modal-enlarge-image').style.width = '400px';
                            }
                        });
                        document.getElementById('next-image-action').addEventListener('click', () => {
                            if (cur > 0) {
                                cur--;
                                document.getElementById('modal-enlarge-image').src = document.getElementById('msg-box-image'+image_msg[cur]).src;
                                document.getElementById('modal-enlarge-image').style.width = '400px';
                            }
                        });
                    });
                }

                for (let i = 0; i < msgIds.length; i++) {
                    document.getElementById('sender'+i).addEventListener('click', () => {
                    document.getElementById('profile').classList.remove('hide');
                    document.getElementById('logged-in').classList.add('hide');

                    document.getElementById('profile-img-edit').classList.add('hide');
                    document.getElementById('profile-name-edit').classList.add('hide');
                    document.getElementById('profile-bio-edit').classList.add('hide');
                    document.getElementById('profile-email-edit').classList.add('hide');
                    document.getElementById('profile-password').classList.add('hide');
                    document.getElementById('profile-update-action').classList.add('hide');
                        
                    makeRequest('/user/'+senderIds[i], 'GET').then((so_many_data) => {
                        document.getElementById('profile-title').innerText = `${so_many_data.name}'s Profile`;
                        if (so_many_data.image === null) {
                            document.getElementById('profile-img').setAttribute('src', "../images/profile.png");
                        } else {
                            document.getElementById('profile-img').src = so_many_data.image;
                        }
                        if (data.bio !== null) {
                            document.getElementById('profile-bio').innerText = so_many_data.bio;
                        } 
                        document.getElementById('profile-name').innerText = so_many_data.name;
                        document.getElementById('profile-email').innerText = so_many_data.email;
                        
                        document.getElementById('profile-name-edit').addEventListener('click', () => {
                            document.getElementById('profile-name').disabled=false;
                        });
                        document.getElementById('profile-bio-edit').addEventListener('click', () => {
                            document.getElementById('profile-bio').disabled=false;
                        });
                        document.getElementById('profile-email-edit').addEventListener('click', () => {
                            document.getElementById('profile-email').disabled=false;
                        });
                        
                        document.getElementById('profile-update-action').addEventListener('click', () => {
                            makeRequest('/user', 'PUT', {
                                password: document.getElementById('reset-password').value,
                                name: document.getElementById('profile-name').value,
                                bio: document.getElementById('profile-bio').value,
                                image: base64String
                            }).then(() => {
                                document.getElementById('modal-body').innerText = "Profile submit.";
                                document.getElementById('modal-title').innerText = 'Success';
                                $('#modal-info').modal('show');
                            });
                        });

                        document.getElementById('profile-back-action').addEventListener('click', () => {
                            document.getElementById('profile').classList.add('hide');
                            document.getElementById('logged-in').classList.remove('hide');
                        });
                    });
                    });
                }

                for (let i = 0; i < msgIds.length; i++) {
                    document.getElementById('delete'+i).addEventListener('click', () => {
                        makeRequest('/message/'+id+'/'+msgIds[i], 'DELETE');
                        if (document.getElementById('pinned-messages').contains(document.getElementById('msg-box'+i))) {
                            document.getElementById('pinned-messages').removeChild(document.getElementById('msg-box'+i));
                        } else {
                            document.getElementById('other-messages').removeChild(document.getElementById('msg-box'+i));
                        }
                    });
                }
                for (let i = 0; i < msgIds.length; i++) {
                    document.getElementById('edit'+i).addEventListener('click', () => {
                        if(userId === senderIds[i]){
                            const msg_box_msg = document.getElementById('box'+i);
                            const parent = msg_box_msg.parentElement;
                            const msg_box_msg_edit = document.createElement('textarea');
                            msg_box_msg_edit.setAttribute('id', 'box-edit'+i);
                            msg_box_msg_edit.innerText = msg_box_msg.innerText;
                            parent.insertBefore(msg_box_msg_edit, parent.children[2]);
                            
                            msg_box_msg.classList.add('hide');
                            
                            const msg_box_submit_action = document.createElement('button');
                            msg_box_submit_action.innerText = 'Submit';
                            msg_box_submit_action.setAttribute('id', 'msg-box-submit-action'+i);
                            parent.insertBefore(document.createElement('br'), parent.children[3]);
                            parent.insertBefore(document.createElement('br'), parent.lastChild);
                            parent.insertBefore(msg_box_submit_action, parent.lastChild);
                            document.getElementById('msg-box-submit-action'+i).addEventListener('click', () => {
                                const msg_box_msg = document.getElementById('box'+i);
                                const msg = msg_box_msg.innerText;
                                const msg_box_msg_edit = document.getElementById('box-edit'+i);
                                const msg_edit = msg_box_msg_edit.value;
                                if (msg === msg_edit) {
                                    document.getElementById('modal-body').innerText = "Same message. Invalid edit.";
                                    document.getElementById('modal-title').innerText = 'Error';
                                    $('#modal-info').modal('show');
                                } else {
                                    makeRequest('/message/'+id+'/'+msgIds[i], 'PUT', {
                                        message : msg_edit
                                    });
                                    msg_box_msg_edit.classList.add('hide');
                                    msg_box_msg.innerText = msg_edit;
                                    msg_box_msg.classList.remove('hide');
                                }
                            });
                        } else {
                            document.getElementById('modal-body').innerText = "You can't edit a message you didn't send";
                            document.getElementById('modal-title').innerText = 'Error';
                            $('#modal-info').modal('show');
                        }
                    });
                }

                for (let i = 0; i < msgIds.length; i++) {
                    document.getElementById('pin'+i).addEventListener('click', () => {
                        const ele = document.getElementById('pin'+i);
                        if (ele.style.textShadow === '' || ele.style.textShadow === 'grey 0px 0px 0px') {
                            makeRequest('/message/pin/'+id+'/'+msgIds[i], 'POST');
                            ele.style.textShadow = '0 0 0 red';
                            document.getElementById('pinned-messages').appendChild(document.getElementById('msg-box'+i));
                        } else {
                            makeRequest('/message/unpin/'+id+'/'+msgIds[i], 'POST');
                            ele.style.textShadow = '0 0 0 grey';
                            document.getElementById('other-messages').appendChild(document.getElementById('msg-box'+i));
                        }
                    });

                    document.getElementById('heart'+i).addEventListener('click',  () => {
                        const ele = document.getElementById('heart'+i);
                        if (ele.style.textShadow === '' || ele.style.textShadow === 'grey 0px 0px 0px') {
                            makeRequest('/message/react/'+id+'/'+msgIds[i], 'POST', {
                                react: 'H'
                            });
                            ele.style.textShadow = '0 0 0 red';
                        } else {
                            makeRequest('/message/unreact/'+id+'/'+msgIds[i], 'POST', {
                                react: 'H'
                            });
                            ele.style.textShadow = '0 0 0 grey';
                        }
                    });
                    document.getElementById('thumb-up'+i).addEventListener('click',  () => {
                        const ele = document.getElementById('thumb-up'+i);
                        if (ele.style.textShadow === '' || ele.style.textShadow === 'grey 0px 0px 0px') {
                            ele.style.textShadow = '0 0 0 red';
                            makeRequest('/message/react/'+id+'/'+msgIds[i], 'POST', {
                                react: 'U'
                            });
                        } else {
                            ele.style.textShadow = '0 0 0 grey';
                            makeRequest('/message/unreact/'+id+'/'+msgIds[i], 'POST', {
                                react: 'U'
                            });
                        }
                    });
                    document.getElementById('thumb-down'+i).addEventListener('click',  () => {
                        const ele = document.getElementById('thumb-down'+i);
                        if (ele.style.textShadow === '' || ele.style.textShadow === 'grey 0px 0px 0px') {
                            ele.style.textShadow = '0 0 0 red';
                            makeRequest('/message/react/'+id+'/'+msgIds[i], 'POST', {
                                react: 'D'
                            });
                        } else {
                            ele.style.textShadow = '0 0 0 grey';
                            makeRequest('/message/unreact/'+id+'/'+msgIds[i], 'POST', {
                                react: 'D'
                            });
                        }
                    });
                }
            });
        });
    });
}

// const displayChannel = (id) => {   
//     displayChannelDetails(id);

//     makeRequest('/message/'+id+'?start=0', 'GET').then((data) => {
//         document.getElementById('channels-list').classList.add('hide');
//         document.getElementById('channel-create').classList.add('hide');
//         document.getElementById('channel-messages').classList.remove('hide');
        
//         document.getElementById('channel-messages-body').remove();
        
//         const channel_messages_body = document.createElement('div');
//         channel_messages_body.setAttribute('id', 'channel-messages-body');
//         document.getElementById('channel-messages').appendChild(channel_messages_body);

//         for (const message of data.messages) {
//             const msg = document.createElement('p');
//             msg.innerText = message.message;
//             document.getElementById('channel-messages-body').appendChild(msg);
//         }
//     });
// }

const displayChannels = () => {
    makeRequest('/channel', 'GET').then((data) => {
        document.getElementById('channel-messages').classList.add('hide');
        document.getElementById('channels').classList.remove('hide');
    
        document.getElementById('channels-list').remove();
    
        const channels_list = document.createElement('div');
        channels_list.setAttribute('id', 'channels-list');
        const h = document.createElement('h3');
        h.innerText = 'Channels';
        channels_list.appendChild(h);
    
        const channel_list_public = document.createElement('div');
        channel_list_public.setAttribute('id', 'channels-list-public');
        const h_pub = document.createElement('h5');
        h_pub.innerText = 'Public Channels';
        channel_list_public.appendChild(h_pub);
        channels_list.appendChild(channel_list_public);
    
        channels_list.appendChild(document.createElement('hr'));
    
        const channel_list_private = document.createElement('div');
        channel_list_private.setAttribute('id', 'channels-list-private');
        const h_pri = document.createElement('h5');
        h_pri.innerText = 'Private Channels';
        channel_list_private.appendChild(h_pri)
        channels_list.appendChild(channel_list_private);
    
        document.getElementById('channels-list-box').appendChild(channels_list);
        for (const channel of data.channels) {
            const channel_link = document.createElement('a');
            channel_link.innerText = channel.name;
            // channel_link.style.color = 'blue';
            channel_link.classList.add('channels');
            channel_link.addEventListener('click', () => {
                channelId = channel.id;
                displayChannelDetails(channelId);
            });
            channelMembers = channel.members;

            const channel_join = document.createElement('a');
            channel_join.innerText = '[join]';
            channel_join.style.color = 'blue';
            channel_join.classList.add('channels');

            const channel_leave = document.createElement('a');
            channel_leave.innerText = '[leave]';
            channel_leave.style.color = 'red';
            channel_leave.classList.add('channels');

            channel_join.addEventListener('click', () => {
                makeRequest('/channel/'+channel.id+'/join', 'POST').then(() => {
                    document.getElementById('modal-body').innerText = "Channel joined successfully.";
                    document.getElementById('modal-title').innerText = 'Success';
                    $('#modal-info').modal('show');
                });
            });

            channel_leave.addEventListener('click', () => {
                makeRequest('/channel/'+channel.id+'/leave', 'POST').then(() => {
                    document.getElementById('modal-body').innerText = "Channel left successfully.";
                    document.getElementById('modal-title').innerText = 'Success';
                    $('#modal-info').modal('show');
                });
            });
            if (channel.private && channelMembers.includes(userId)){                
                document.getElementById('channels-list-private').appendChild(channel_link);
                document.getElementById('channels-list-private').append("   ");
                document.getElementById('channels-list-private').appendChild(channel_join);
                document.getElementById('channels-list-private').append("   ");
                document.getElementById('channels-list-private').appendChild(channel_leave);
                document.getElementById('channels-list-private').appendChild(document.createElement('br'));
            } else if(!channel.private) {
                document.getElementById('channels-list-public').appendChild(channel_link);
                document.getElementById('channels-list-public').append("    ");
                document.getElementById('channels-list-public').appendChild(channel_join);
                document.getElementById('channels-list-public').append("   ");
                document.getElementById('channels-list-public').appendChild(channel_leave);
                document.getElementById('channels-list-public').appendChild(document.createElement('br'));
            }
        }

    });
};

document.getElementById('channel-create-action').addEventListener('click', () => {
    const name = document.getElementById('channel-create-name').value;
    const isPrivate = (document.getElementById('is_private_true').checked === true);
    let des = document.getElementById('channel-create-des').value;
    if (des === "") {
        des = "This is a defualt description";
    }
    makeRequest('/channel', 'POST', {
        name : name,
        private : isPrivate,
        description : des,
    }).then(() => {
        displayChannels();
    });
});

const loggedin = () => {
    document.getElementById('logged-out').classList.add('hide');
    document.getElementById('logged-in').classList.remove('hide');
    displayChannels();
}

const loggedout = () => {
    document.getElementById('logged-in').classList.add('hide');
    document.getElementById('logged-out').classList.remove('hide');
}

document.getElementById('nav-login').addEventListener('click', () => {
    document.getElementById('register').classList.add('hide');
    document.getElementById('login').classList.remove('hide');
});

document.getElementById('nav-register').addEventListener('click', () => {
    document.getElementById('login').classList.add('hide');
    document.getElementById('register').classList.remove('hide');
});

document.getElementById('nav-back').addEventListener('click', () => {
    if (!document.getElementById('channels').classList.contains('hide')) {
        loggedout();
        token = null;
        userId = null; 
    } else {
        displayChannels();
    }
});

document.getElementById('nav-profile').addEventListener('click', () => {
    document.getElementById('profile').classList.remove('hide');
    document.getElementById('logged-in').classList.add('hide');

    document.getElementById('profile-img-edit').classList.remove('hide');
    document.getElementById('profile-name-edit').classList.remove('hide');
    document.getElementById('profile-bio-edit').classList.remove('hide');
    document.getElementById('profile-email-edit').classList.remove('hide');    
    document.getElementById('profile-password').classList.remove('hide');    
    document.getElementById('profile-update-action').classList.remove('hide');    

    makeRequest('/user/'+userId, 'GET').then((data) => {
        let base64String = "";
        document.getElementById('profile-title').innerText = `${data.name}'s Profile`;
        if (data.image === null) {
            document.getElementById('profile-img').setAttribute('src', "../images/profile.png");
        } else {
            document.getElementById('profile-img').src = data.image;
            base64String = data.image;
        }
        if (data.bio !== null) {
            document.getElementById('profile-bio').innerText = data.bio;
        } 
        document.getElementById('profile-name').innerText = data.name;
        document.getElementById('profile-email').innerText = data.email;

        document.getElementById('profile-img-edit').addEventListener('click', () => {
            $('#modal-upload').modal('show');

            document.getElementById('modal-upload-img').addEventListener('change', () => {
                var file = document.getElementById('modal-upload-img').files[0];
            
                var reader = new FileReader();
                
                reader.onload = function () {
                    base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
                    base64String = 'data:image/png;base64,'+base64String;
                    document.getElementById('profile-img').src = base64String;
                }
                reader.readAsDataURL(file);
            });
        });
        
        document.getElementById('profile-name-edit').addEventListener('click', () => {
            document.getElementById('profile-name').disabled=false;
        });
        document.getElementById('profile-bio-edit').addEventListener('click', () => {
            document.getElementById('profile-bio').disabled=false;
        });
        document.getElementById('profile-email-edit').addEventListener('click', () => {
            document.getElementById('profile-email').disabled=false;
        });
        
        document.getElementById('profile-update-action').addEventListener('click', () => {
            makeRequest('/user', 'PUT', {
                password: document.getElementById('reset-password').value,
                name: document.getElementById('profile-name').value,
                bio: document.getElementById('profile-bio').value,
                image: base64String
            }).then(() => {
                document.getElementById('modal-body').innerText = "Profile submit.";
                document.getElementById('modal-title').innerText = 'Success';
                $('#modal-info').modal('show');
            });
        });

        document.getElementById('profile-back-action').addEventListener('click', () => {
            document.getElementById('profile').classList.add('hide');
            document.getElementById('logged-in').classList.remove('hide');
        });
    })
});

document.getElementById('profile-show-action').addEventListener('click', () => {
    let reset_passsw = document.getElementById("reset-password");
    if (reset_passsw.type === "password") {
        reset_passsw.type = "text";
    } else {
        reset_passsw.type = "password";
    }
})