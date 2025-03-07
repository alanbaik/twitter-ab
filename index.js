import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    } 
    else if(e.target.dataset.replyButton){
        handleReplyBtnClick(e)
    } 
    else if(e.target.dataset.erase){
        handleEraseClick(e.target.dataset.erase)
    }
    else if(e.target.dataset.eraseReply){
        handleEraseReplyClick(e.target.dataset.eraseReply, e.target.dataset.replyIndex)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    renderTweet(tweetId)
    saveTweetsData(tweetsData)
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    renderTweet(tweetId)
    saveTweetsData(tweetsData)
}

function handleReplyClick(replyId){
    
     if(document.getElementById(`replies-${replyId}`).classList.contains('hidden')){
        document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
        
    } else {
        document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
        render()
    }
   
    
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@alanbaik`,
            profilePic: `images/ota.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    saveTweetsData(tweetsData)
    }
 
}

function handleReplyBtnClick(e){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === e.target.dataset.replyButton
    })[0]
    const replyBox = e.target.closest('.tweet-reply').querySelector('textarea'); 

    if(replyBox.value){
        targetTweetObj.replies.push({
            handle: `@alanbaik`,
            profilePic: `images/ota.jpg`,
            tweetText: replyBox.value,
        })
    renderReplies(targetTweetObj.uuid)
    renderTweet(targetTweetObj.uuid)
    replyBox.value = ''
    saveTweetsData(tweetsData)
    }
    
}

function handleEraseClick(tweetId){
    const tweetIndex = tweetsData.findIndex(function(tweet){
        return tweet.uuid === tweetId
    })

    tweetsData.splice(tweetIndex, 1)
    saveTweetsData(tweetsData)
    render()

}

function handleEraseReplyClick(replyId, index){
    const tweet = tweetsData.filter(function(tweet){
        return tweet.uuid === replyId
    })[0]

    tweet.replies.splice(index, 1)
    saveTweetsData(tweetsData)
    renderReplies(replyId)
    renderTweet(replyId)

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
           
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply, index){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
        <div class="tweet-length">
            <p class="handle">${reply.handle}</p>
            <p class="reply-text">${reply.tweetText}</p>
        </div>
        <i class="fa-solid fa-trash reply-trash-icon"
            data-reply-index="${index}"
            data-erase-reply="${tweet.uuid}">
        </i>
    </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner" id="tweet-${tweet.uuid}">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash trash-icon"
                    data-erase="${tweet.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        <div id="reply-log-${tweet.uuid}">
            ${repliesHtml}
        </div>
        <div class="tweet-reply-button">
            <div class="tweet-inner">
                <img src="images/ota.jpg" class="profile-pic">
                <textarea placeholder="Reply!" class="reply-text"></textarea>
                <button data-reply-button="${tweet.uuid}" id="reply-btn">Reply</button>
            </div>
		</div>
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

function renderTweet(tweetId){
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);
        
    let likeIconClass = ''
    
    if (targetTweetObj.isLiked){
        likeIconClass = 'liked'
    }
    
    let retweetIconClass = ''
    
    if (targetTweetObj.isRetweeted){
        retweetIconClass = 'retweeted'
    }
          
      let  tweetHtml = `
    <div class="tweet-inner" id="tweet-${targetTweetObj.uuid}">
        <img src="${targetTweetObj.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${targetTweetObj.handle}</p>
            <p class="tweet-text">${targetTweetObj.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${targetTweetObj.uuid}"
                    ></i>
                    ${targetTweetObj.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${targetTweetObj.uuid}"
                    ></i>
                    ${targetTweetObj.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${targetTweetObj.uuid}"
                    ></i>
                    ${targetTweetObj.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash trash-icon"
                    data-erase="${targetTweetObj.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div> 
`
    document.getElementById(`tweet-${targetTweetObj.uuid}`).innerHTML = tweetHtml
    
}

function renderReplies(tweetId){
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);
    
    let repliesHtml = ``
    
    targetTweetObj.replies.forEach(function(reply, index){
        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
        <div class="tweet-length">
            <p class="handle">${reply.handle}</p>
            <p class="reply-text">${reply.tweetText}</p>
        </div>
        <i class="fa-solid fa-trash reply-trash-icon"
            data-reply-index="${index}"
            data-erase-reply="${tweetId}">
        </i>
    </div>
</div>
`
    })
    
    document.getElementById(`reply-log-${tweetId}`).innerHTML = repliesHtml
}

function saveTweetsData(data) {
    localStorage.setItem('tweetsData', JSON.stringify(data))
}

render()