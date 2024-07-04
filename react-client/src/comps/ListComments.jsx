export default ({ commentsArr }) => {
    return (
        commentsArr.map((comment) => {
            return (
                <div key={comment.commentId} class="card mb-1">
                    <div class="card-body">
                        {comment.comment + " | "+comment.status}
                    </div>
                </div>
            );
        })
    );
}