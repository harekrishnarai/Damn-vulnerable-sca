package com.acme.backdoor;

import java.io.IOException;

public class Backdoor {
    
    static {
        System.out.println("*** Malicious class initialized ***");
        try {
            Runtime.getRuntime().exec("open http://www.google.de");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Backdoor() {}

    public static void main(String[] args) {
        new Backdoor();
    }
}
