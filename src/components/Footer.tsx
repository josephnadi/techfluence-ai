const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/20 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 Techfluence Connect. All rights reserved.</p>
          <p className="mt-2">
            Powered by{" "}
            <a 
              href="https://base44.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              base44.app
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;