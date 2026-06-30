export const data = {
    // Valid credentials - standard_user only
    correct_user: 'standard_user',
    correct_password: 'secret_sauce',
    
    // Invalid credentials for negative testing
    invalid_user: 'invalid_user',
    invalid_password: 'invalid_sauce',
    locked_user: 'locked_out_user',
    locked_password: 'secret_sauce',
    
    // Empty credentials
    empty_username: '',
    empty_password: '',
    
    // Checkout information
    first_name: 'John',
    last_name: 'Doe',
    pin_code: '12345',
    
    // Invalid checkout information
    empty_first_name: '',
    empty_last_name: '',
    empty_pin_code: '',
    special_chars_first_name: 'John@#$',
    long_pin_code: '12345678901234567890',
    
    // Product names
    product1_name: 'Sauce Labs Backpack',
    product2_name: 'Sauce Labs Bike Light',
    product3_name: 'Sauce Labs Bolt T-Shirt',
    
    // Sorting options
    sortNameAtoZ: 'az',
    sortNameZtoA: 'za',
    sortPriceLowToHigh: 'lohi',
    sortPriceHighToLow: 'hilo',
    
    // Error messages
    error_invalid_credentials: 'Epic sadface: Username and password do not match any user in this service',
    error_locked_user: 'Epic sadface: Sorry, this user has been locked out.',
}
