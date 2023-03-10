<template>
    <div class="wrapper_block_comments">
        <div class="wrapper_block_comments_title">
            <div class="wrapper_block_comments_title_name_ava">
                <div class="wrapper_block_comments_ava"
                    @click="$router.push({ name: 'mypage', params: { id: `${dialog.userID}` } })">
                    <img class="ava_posts" src="../../assets/ava/ava_1.jpg" alt="ava">
                </div>
                <div class="wrapper_block_comments_name">
                    <p class="block_comments_name">Илья Сазонов</p>
                </div>
            </div>

            <div class="wrapper_block_comments_date">
                <p class="block_comments_date">2010-02-23</p>
            </div>
        </div>


        <div class="wrapper_block_comments_item">
            <div class="wrapper_block_comments_item_like">
                <p class="count_likes">10</p>

                <img class="likes" src="../../assets/icons/like.svg" alt="like">

                <!-- подкрашивать сердце если пост лайкнут -->
                <!-- <img class="likes"  
                    src="../../assets/icons/like_full.png"  
                    alt="like" 
                    v-if="post.like_post == 1"
                    @click="countLikes(post)"> -->

            </div>
        </div>

        <!-- комментарии -->
        <div class="wrapper_block_comments_comment">
            <CommentPhoto />      
        </div>

        <div class="wrapper_under_write_comments">
            <WriteCommentPhoto />
        </div>
</div>
</template>

<script>
export default {
    name: "CommentsPhoto",

}
</script>

<style scoped>
.wrapper_block_comments {
    width: 30%;
    background: whitesmoke;
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.wrapper_block_comments_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.wrapper_block_comments_title_name_ava {
    display: flex;
    align-items: center;
}

.wrapper_block_comments_ava {}

.ava_posts {
    width: 50px;
    border-radius: 100%;
    cursor: pointer;
}

.wrapper_block_comments_name {
    margin-left: 5px;
}

.block_comments_name {
    font-family: fantasy;
    font-size: 18px;
}

.wrapper_block_comments_date {}

.block_comments_date {}

.wrapper_block_comments_item {}

.wrapper_block_comments_item_like {
    display: flex;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 17px;
}

.count_likes {
    font-size: 20px;
    font-family: fantasy;
}

.likes {
    width: 30px;
    margin-left: 2px;
    cursor: pointer;
}

.wrapper_block_comments_dislike {}

.wrapper_block_comments_comment {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    white-space: normal;
    flex-grow: 1;
    overflow: auto;
}

.block_comments_comment {}
</style>