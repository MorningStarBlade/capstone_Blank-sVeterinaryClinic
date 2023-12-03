$(function() {
    $('#updateAvatarBtn').on('click', function(e) {
        e.preventDefault();

        var selectedAvatar = $('#avatar').val();

        $.ajax({
            url: '/updateAvatar',
            method: 'POST',
            data: { avatar: selectedAvatar },
            success: function(response) {
                console.log('User avatar updated successfully:', response);

                $('#profileImage').fadeOut(500, function() {

                    $('#profileImage').attr('src', '/pictures/' + selectedAvatar);

                    $('#profileImage').fadeIn(1000);
                });

                $('#headingAvatar').fadeOut(500, function() {

                    $('#headingAvatar').attr('src', '/pictures/' + selectedAvatar);

                    $('#headingAvatar').fadeIn(1000);
                });
            },
            error: function(error) {
                console.error('Error updating user avatar:', error);
            }
        });
    });
});
