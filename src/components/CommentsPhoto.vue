<template>
    <div class="wrapper_block_comments">
            <div class="wrapper_block_comments_name">
                <p class="block_comments_name">Илья Сазонов</p>
            </div>
            <div class="wrapper_block_comments_date">
                <p class="block_comments_date">2010-02-23</p>
            </div>
            <div class="wrapper_block_comments_item">
                <div class="wrapper_block_comments_item_like">
                    like
                </div>
                <div class="wrapper_block_comments_dislike">
                    dislike
                </div>
            </div>
            <div class="wrapper_block_comments_comment">
                <p class="block_comments_comment">Lorem ipsum dolor sit amet.</p>
            </div>
            <div class="wrapper_block_comments_comment">
                <p class="block_comments_comment">Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, id.</p>
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
}
.wrapper_block_comments_name {
}
.block_comments_name {
}
.wrapper_block_comments_date {
}
.block_comments_date {
}
.wrapper_block_comments_item {
}
.wrapper_block_comments_item_like {
}
.wrapper_block_comments_dislike {
}
.wrapper_block_comments_comment {
}
.block_comments_comment {
}
</style>