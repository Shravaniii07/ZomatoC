from flask import Flask, render_template, url_for
import data

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/delivery.html')
def delivery():
    return render_template('delivery.html', restaurants=data.restaurants)

@app.route('/dining.html')
def dining():
    return render_template('dining.html', restaurants=data.restaurants)

@app.route('/nightlife.html')
def nightlife():
    return render_template('nightlife.html', restaurants=data.restaurants)

@app.route('/payment.html')
def payment():
    return render_template('payment.html')

@app.route('/login.html')
def login():
    return render_template('login.html')

@app.route('/signup.html')
def signup():
    return render_template('signup.html')

@app.route('/restaurant/<int:id>')
def restaurant_detail(id):
    restaurant = data.get_restaurant_by_id(id)
    if not restaurant:
        return "Restaurant not found", 404
    menu = data.get_menu_for_restaurant(restaurant['name'])
    return render_template('restaurant_detail.html', restaurant=restaurant, menu=menu)

@app.route('/index.html')
def index_redirect():
    return index()

# Generic route to serve any other top-level HTML file (e.g. 2kitchen.html)
@app.route('/<path:filename>.html')
def serve_html(filename):
    return render_template(f'{filename}.html')

# Generic route for user folder
@app.route('/user/<path:filename>')
def serve_user_html(filename):
    return render_template(f'user/{filename}')

# Generic route for admin folder
@app.route('/admin/<path:filename>')
def serve_admin_html(filename):
    return render_template(f'admin/{filename}')

# if __name__ == '__main__':
#     app.run(debug=True)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
