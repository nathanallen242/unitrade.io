import random
from datetime import datetime, timedelta

def random_date(start, end):
    """Generate a random datetime between `start` and `end`."""
    return start + timedelta(
        seconds=random.randint(0, int((end - start).total_seconds())),
    )

def generate_spam_post():
    """Generate a more complex synthetic spam post."""
    spam_titles = ["Just thinking about life", "Amazing travel experience", "My daily routine", "Discover the secrets to success"]
    spam_content = ["Check our website for more", "Join our exclusive group", "DM for incredible offers", "Click the link below"]
    tags = ["lifestyle", "travel", "daily", "success"]
    return f"{random.choice(spam_titles)}. {random.choice(spam_content)} {' '.join(random.sample(tags, k=2))}"

def generate_not_spam_post():
    """Generate a more complex synthetic not spam post."""
    sale_titles = ["Selling barely used laptop", "Offer on sports gear", "Preloved books for sale", "Handcrafted items on discount"]
    sale_descriptions = ["In perfect condition", "Great deals available", "Contact for more details", "DM if interested"]
    sale_tags = ["electronics", "sports", "books", "handcrafted"]
    return f"{random.choice(sale_titles)} - {random.choice(sale_descriptions)} {' '.join(random.sample(sale_tags, k=2))}"

def load_data(num_samples=1000):
    """Generate a dataset of synthetic posts."""
    data = {'text': [], 'label': []}
    # Generate spam posts
    for _ in range(num_samples):
        post = generate_spam_post()
        data['text'].append(post)
        data['label'].append('spam')
    # Generate not spam posts
    for _ in range(num_samples):
        post = generate_not_spam_post()
        data['text'].append(post)
        data['label'].append('not_spam')
    return data

if __name__ == '__main__':
    dataset = load_data()
    print(dataset)  # Print some examples for demonstration
