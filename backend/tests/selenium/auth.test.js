const { createDriver } = require('./config');
const { By, until } = require('selenium-webdriver');

// CONFIG: velocidad de escritura lenta
const SLOW = 50; 

async function pause(t = SLOW) {
    return new Promise(res => setTimeout(res, t));
}

async function slowSend(element, text) {
    for (const char of text) {
        await element.sendKeys(char);
        await pause(40); 
    }
}

// USUARIO DE PRUEBA
const testUser = {
    username: 'testuser' + Date.now(),
    email: 'test' + Date.now() + '@example.com',
    password: 'secure123'
};

jest.setTimeout(60000);

describe('Pruebas de Autenticación - Sistema Completo', () => {
    let driver;

    beforeAll(async () => {
        driver = await createDriver();
        await driver.manage().setTimeouts({ implicit: 10000 });
    }, 45000);

    afterAll(async () => {
        if (driver) await driver.quit();
    });

    async function cerrarModalIfExists() {
        try {
            await pause();
            const modal = await driver.findElement(By.css('div.fixed.inset-0'));
            const boton = await modal.findElement(By.tagName('button'));
            await boton.click();
            await driver.wait(until.stalenessOf(modal), 10000);
            await pause();
        } catch (_) {}
    }

    // 1. Registro
    test('1. Registro de nuevo usuario', async () => {
        await driver.get('http://localhost:5173/register');
        await pause();

        await slowSend(driver.findElement(By.name('username')), testUser.username);
        await pause();
        await slowSend(driver.findElement(By.name('email')), testUser.email);
        await pause();
        await slowSend(driver.findElement(By.name('password')), testUser.password);

        await pause();
        await driver.findElement(By.tagName('button')).click();

        await cerrarModalIfExists();

        await driver.wait(until.urlContains('/login'), 20000);
        const url = await driver.getCurrentUrl();
        expect(url).toContain('/login');
    });

    // 2. Login
    test('2. Login con credenciales válidas', async () => {
        await slowSend(driver.findElement(By.name('username')), testUser.username);
        await pause();
        await slowSend(driver.findElement(By.name('password')), testUser.password);

        await pause();
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));
        await loginButton.click();

        await driver.wait(until.urlContains('/finanzas'), 30000);

        const url = await driver.getCurrentUrl();
        expect(url).toContain('/finanzas');
    });

    // 3. Logout con velocidad reducida
    test('3. Logout exitoso', async () => {
        await pause();

        const logoutButton = await driver.findElement(
            By.xpath(
                "//button[contains(text(), 'Cerrar sesión')] | " +
                "//button[contains(text(), 'Salir')] | " +
                "//button[contains(text(), 'Logout')]"
            )
        );

        await pause();
        await logoutButton.click();
        await pause();

        await driver.wait(async () => {
            const current = await driver.getCurrentUrl();
            return current.endsWith('/') || current.includes('/home');
        }, 15000);

        const currentUrl = await driver.getCurrentUrl();

        expect(
            currentUrl.endsWith('/') ||
            currentUrl.includes('/home')
        ).toBe(true);
    });
});
