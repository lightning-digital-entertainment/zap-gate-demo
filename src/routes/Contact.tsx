import React from "react";

function Contact() {
    return (
        <div className="flex flex-col items-center w-full text-center">
            <h2 className="text-bold text-2xl">Get in touch!</h2>
            <p className="p-4 bg-zinc-800 m-4 rounded">
                This website is a demo / POC for ZapGated content on nostr. You
                can leave your thoughts on the <a href="https://github.com/Egge7/nips/blob/zapGates/XX.md">GitHub Repository</a> or you
                can simply send a message to Egge on <a href="https://snort.social/p/npub1mhcr4j594hsrnen594d7700n2t03n8gdx83zhxzculk6sh9nhwlq7uc226">nostr</a> or <a href="https://twitter.com/Egge21M">twitter</a>.
            </p>
        </div>
    );
}

export default Contact;
