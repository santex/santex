
use Mojo::EventEmitter;
use feature qw(say);


use Mojo::IOLoop;

# Listen on port 3000
my $id = Mojo::IOLoop->server({port => 3000} => sub {
    my ($loop, $stream, $id) = @_;

    $stream->on(read => sub {
        my ($stream, $chunk) = @_;

        # Process input chunk
        say "Server: $chunk";

        # Write response
        $stream->write("HTTP/1.1 200 OK\x0d\x0a\x0d\x0a");

        # Disconnect client
        $stream->close_gracefully();
    });
});

# Connect to port 3000
Mojo::IOLoop->client({port => 3000} => sub {
    my ($loop, $err, $stream) = @_;

    $stream->on(read => sub {
        my ($stream, $chunk) = @_;

        # Process input
        say "Client: $chunk";
    });

    # Write request
    $stream->write("GET / HTTP/1.1\x0d\x0a\x0d\x0a");
});

my $x = 0;
    
# Add a timer
Mojo::IOLoop->timer($x => sub {
    my $loop = shift;
    my $x = shift;
	say "Timeout";

    # Shutdown server    
    $loop->remove($id) unless $x<1000;

	$x++;
});

# Start event loop
Mojo::IOLoop->start;
